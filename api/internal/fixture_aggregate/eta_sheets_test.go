package fixture_aggregate

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_ProcessEtaSheet(t *testing.T) {
	t.Parallel()

	raw, err := os.ReadFile("./fixtures/nts_2404.json")

	if err != nil {
		fmt.Println(err)
	}

	var ts testSubject

	err = json.Unmarshal(raw, &ts)

	if err != nil {
		fmt.Println(err)
	}

	teams := map[string]bool{}
	referees := map[string]bool{}
	times := map[string]bool{}
	pitches := map[string]bool{}
	stages := map[string]bool{}

	processor := processEtaSheet(teams, referees, pitches, stages, times)

	for _, sched := range ts.Data {
		for _, psbd := range sched.Schedules {
			schedulePitchMap := produceSchedulePitchMap(psbd.Ranges.FixturePitches.Values)
			_ = processor("19th Aug 23", psbd.Ranges.Fixtures.Values, psbd.Ranges.RefAllocations.Values, psbd.Ranges.Fixtures.Range, schedulePitchMap)
		}
	}

	assert.Equal(t, 57, len(teams))
	assert.Equal(t, 65, len(referees))
	assert.Equal(t, 21, len(times))
	assert.Equal(t, 6, len(pitches))
	assert.Equal(t, 34, len(stages))
}
