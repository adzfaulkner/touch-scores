package handler

import (
	"fmt"
	"github.com/adzfaulkner/touch-scores/internal/goog"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/gocolly/colly"
	"go.uber.org/zap"
	"golang.org/x/exp/maps"
)

const InitialUrl = "https://www.internationaltouch.org/events/world-cup/2024/"
const SheetID = "1TWcOcSM74c3wXTh_8IDcKbaeaMccDwgr-utliWK6ARs"

type Fixture struct {
	Date               string
	Time               string `json:"time"`
	Stage              string `json:"stage"`
	Pitch              string `json:"pitch"`
	HomeTeam           string `json:"homeTeam"`
	HomeTeamScore      string `json:"homeTeamScore"`
	HomeTeamScoreRange string `json:"HomeTeamScoreRange"`
	AwayTeam           string `json:"awayTeam"`
	AwayTeamScore      string `json:"awayTeamScore"`
	AwayTeamScoreRange string `json:"awayTeamScoreRange"`
	Ref1               string `json:"ref1"`
	Ref1Range          string `json:"ref1Range"`
	Ref2               string `json:"ref2"`
	Ref2Range          string `json:"ref2Range"`
	Ref3               string `json:"ref3"`
	Ref3Range          string `json:"ref3Range"`
	Video              string `json:"video"`
	Report             string `json:"report"`
}

var mutex = &sync.Mutex{}

var fixtures = make(map[string]Fixture)
var dates = make(map[string]bool)
var dateTimes = make(map[string]bool)
var times = make(map[string]bool)
var pitches = map[string]bool{
	"Riverside 9":  true,
	"Riverside 10": true,
}

func handleScape(clearSheetVals goog.ClearSheetValuesFunc, updateVals goog.UpdateSheetValuesFunc, getVals goog.GetSheetValuesFunc, log logger) events.APIGatewayProxyResponse {
	c := colly.NewCollector(
		colly.UserAgent("thetouch.live TWC2024 fixture scraper"),
	)
	c.SetRequestTimeout(15 * time.Second)

	c.OnHTML(".category-list", func(e *colly.HTMLElement) {
		errDet := false

		cc := colly.NewCollector(
			colly.UserAgent("thetouch.live TWC2024 fixture scraper"),
			colly.MaxDepth(2),
			colly.Async(true),
		)

		cc.OnError(func(resp *colly.Response, err error) {
			errDet = true
			log.Error("Error occurred whilst making req", zap.Error(err), zap.Reflect("response", resp))
		})

		cc.SetRequestTimeout(15 * time.Second)

		e.ForEach("a", func(i int, h *colly.HTMLElement) {
			cc.OnHTML("div.content-block", setFixtures)

			log.Info("Found url", zap.String("url", h.Attr("href")))

			_ = cc.Visit(h.Request.AbsoluteURL(h.Attr("href")))
		})

		cc.Wait()

		if errDet {
			log.Info("Exiting due to error in get fixture request(s)")
			return
		}

		toWrite := flattenFixtures()

		SheetName := "Test"
		if os.Getenv("STAGE") == "prod" {
			SheetName = "Schedule"
		}

		bgv, _ := getVals(SheetID, []string{SheetName})

		rs := map[string][][]interface{}{}
		rs[SheetName] = toWrite

		_, err := updateVals(SheetID, rs)

		if err != nil {
			log.Error("Error occurred whilst updating schedule vals", zap.Error(err))
		}

		if len(bgv.ValueRanges[0].ValueRange.Values) > len(toWrite) {
			d := len(bgv.ValueRanges[0].ValueRange.Values) - len(toWrite)
			r := fmt.Sprintf("%s!%d:%d", SheetName, d+1, len(bgv.ValueRanges[0].ValueRange.Values))

			err = clearSheetVals(SheetID, r)

			if err != nil {
				log.Error("Error occurred whilst clearing schedule", zap.Error(err))
			}
		}
	})

	c.OnError(func(resp *colly.Response, err error) {
		log.Error("Error occurred whilst making initial req", zap.Error(err), zap.Reflect("response", resp))
	})

	_ = c.Visit(InitialUrl)

	return *generateResponse(200, "Operation complete")
}

func setFixtures(e *colly.HTMLElement) {
	var division string
	var stage string
	var date string
	var label string
	var fixture Fixture

	e.ForEach("h2,h3,h4,td.label,td.time,td.field,td.home,td.score,td.away", func(i int, h *colly.HTMLElement) {
		switch h.Name {
		case "h2":
			division = strings.TrimSpace(h.Text)
		case "h3":
			stage = strings.TrimSpace(h.Text)
		case "h4":
			date = strings.TrimSpace(h.Text)

			mutex.Lock()
			dates[date] = true
			mutex.Unlock()
		case "td":
			if h.DOM.HasClass("label") {
				if strings.TrimSpace(h.ChildText("strong")) != "" {
					label = h.Text
				}

				fixture = Fixture{
					Date:               date,
					Time:               "",
					Stage:              fmt.Sprintf("%s %s - %s", division, stage, strings.TrimSpace(label)),
					Pitch:              "",
					HomeTeam:           "",
					HomeTeamScore:      "",
					HomeTeamScoreRange: "",
					AwayTeam:           "",
					AwayTeamScore:      "",
					AwayTeamScoreRange: "",
					Ref1:               "",
					Ref1Range:          "",
					Ref2:               "",
					Ref2Range:          "",
					Ref3:               "",
					Ref3Range:          "",
					Video:              "",
					Report:             "",
				}
			} else if h.DOM.HasClass("time") {
				fixture.Time = convertTo24Hour(strings.TrimSpace(h.ChildText("span")))

				mutex.Lock()
				dateTimes[fmt.Sprintf("%s|%s", date, fixture.Time)] = true
				times[fixture.Time] = true
				mutex.Unlock()

				vidHref := h.ChildAttr("a", "href")

				if strings.Contains(vidHref, "video") {
					fixture.Video = h.Request.AbsoluteURL(vidHref)
				}
			} else if h.DOM.HasClass("field") {
				fixture.Pitch = strings.TrimSpace(h.ChildText("span"))
				mutex.Lock()
				pitches[fixture.Pitch] = true
				mutex.Unlock()
			} else if h.DOM.HasClass("home") {
				fixture.HomeTeam = addTeamDivAbbrev(strings.TrimSpace(h.ChildText("span")), division)
			} else if h.DOM.HasClass("away") {
				fixture.AwayTeam = addTeamDivAbbrev(strings.TrimSpace(h.ChildText("span")), division)
			} else if h.DOM.HasClass("score") {
				if fixture.HomeTeamScore == "" {
					fixture.HomeTeamScore = strings.TrimSpace(h.Text)
				} else {
					fixture.AwayTeamScore = strings.TrimSpace(h.Text)
				}
			} else if h.DOM.HasClass("report") {
				fixture.Report = h.ChildAttr("a", "href")
			}
		}

		if fixture.Date != "" && fixture.Time != "" && fixture.Pitch != "" {
			mutex.Lock()
			fixtures[fmt.Sprintf("%s|%s|%s", fixture.Date, fixture.Time, fixture.Pitch)] = fixture
			mutex.Unlock()
		}
	})
}

func flattenFixtures() [][]interface{} {
	var data [][]interface{}

	data = append(data, []interface{}{
		"Date updated:",
		time.Now().Format(time.RFC822),
	})

	for _, date := range sortDates(maps.Keys(dates)) {
		for _, tt := range sortTimes(maps.Keys(times)) {
			if _, ok := dateTimes[fmt.Sprintf("%s|%s", date, tt)]; !ok {
				continue
			}

			for _, pitch := range sortPitches(maps.Keys(pitches)) {
				if fix, ok := fixtures[fmt.Sprintf("%s|%s|%s", date, tt, pitch)]; ok {
					row := []interface{}{
						fmt.Sprintf("%s, %s, %s", fix.Date, fix.Time, fix.Pitch),
						fmt.Sprintf("%s, %s", fix.HomeTeam, fix.AwayTeam),
						fix.Date,
						fix.Time,
						fix.Pitch,
						fix.Stage,
						fix.HomeTeam,
						numeric(fix.HomeTeamScore),
						numeric(fix.AwayTeamScore),
						fix.AwayTeam,
						fix.Video,
						fix.Report,
					}

					data = append(data, row)
				} else {
					row := []interface{}{fmt.Sprintf("%s, %s, %s", date, tt, pitch), "", date, tt, pitch, "", "", "", "", "", "", ""}
					data = append(data, row)
				}
			}
		}
	}

	return data
}

func convertTo24Hour(time string) string {
	timeAmPm := strings.Split(time, " ")
	hoursMins := strings.Split(timeAmPm[0], ":")

	hour, _ := strconv.Atoi(hoursMins[0])

	if hour < 12 && len(timeAmPm) >= 1 && timeAmPm[1] == "p.m." {
		hour = hour + 12
	}

	return fmt.Sprintf("%d:%s", hour, hoursMins[1])
}

func addTeamDivAbbrev(team, div string) string {
	d := strings.Split(div, " ")

	var age string
	if d[1] == "Open" {
		age = "O"
	} else {
		age = d[1]
	}

	var divAbbrev string
	if div[0:5] == "Mixed" {
		divAbbrev = fmt.Sprintf("%s%s", "X", age)
	} else {
		divAbbrev = fmt.Sprintf("%s%s", div[0:1], age)
	}

	if divAbbrev == "XOpen" {
		divAbbrev = "XO"
	}

	return fmt.Sprintf("(%s) %s", divAbbrev, team)
}

func sortDates(vals []string) []string {
	sort.Slice(vals, func(i, j int) bool {
		l := strings.Split(vals[i], " ")
		r := strings.Split(vals[j], " ")
		ll, _ := strconv.Atoi(l[0])
		rr, _ := strconv.Atoi(r[0])

		return ll < rr
	})

	return vals
}

func sortTimes(vals []string) []string {
	sort.Slice(vals, func(i, j int) bool {
		l := strings.Replace(vals[i], ":", "", 1)
		r := strings.Replace(vals[j], ":", "", 1)
		ll, _ := strconv.Atoi(l)
		rr, _ := strconv.Atoi(r)

		return ll < rr
	})

	return vals
}

func sortPitches(vals []string) []string {
	sort.Slice(vals, func(i, j int) bool {
		l := strings.Split(vals[i], " ")
		r := strings.Split(vals[j], " ")

		if l[0][0:1] == r[0][0:1] {
			ll, _ := strconv.Atoi(l[1])
			rr, _ := strconv.Atoi(r[1])

			return ll < rr
		}

		return l[0][0:1] == "H"
	})

	return vals
}

func numeric(input string) string {
	if input == "-" {
		return "-"
	}

	r, _ := regexp.Compile("([0-9]+)")

	return r.FindString(input)
}
