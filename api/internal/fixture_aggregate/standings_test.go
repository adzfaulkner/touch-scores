package fixture_aggregate

import (
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func Test_FilterStandings(t *testing.T) {
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

	var encd struct {
		Standings [][]string `json:"standings"`
	}

	encd.Standings = filterStandings(ts.Data[0].Standings[0].Values)

	actual, _ := json.Marshal(encd)

	assert.Equal(t, "{\"standings\":[[\"Position\",\"Team\",\"Points\",\"Try Diff\",\"Tries For\"],[\"1st Place\",\"(W) London Scorpions\",\"12\",\"26\",\"33\"],[\"2nd Place\",\"(W) NQ Rebels\",\"9\",\"15\",\"23\"],[\"3rd Place\",\"(W) Cambridge\",\"6\",\"-16\",\"8\"],[\"4th Place\",\"(W) Revolution\",\"3\",\"-25\",\"7\"]]}", string(actual))
}
