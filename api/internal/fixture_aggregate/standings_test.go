package fixture_aggregate

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_FilterStandings(t *testing.T) {
	t.Parallel()

	raw, err := os.ReadFile("./data/seds_24_25_r1_fixture.json")

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

	assert.Equal(t, "{\"standings\":[[\"Pos\",\"Team\",\"PL\",\"TF\",\"TA\",\"TD\",\"Pts\"],[\"1\",\"London Eagles\",\"6\",\"30\",\"6\",\"24\",\"24\"],[\"2\",\"Farnham Hornets\",\"6\",\"24\",\"12\",\"12\",\"19\"],[\"3\",\"Wolves\",\"6\",\"19\",\"16\",\"3\",\"16\"],[\"4\",\"Invicta Touch\",\"6\",\"15\",\"21\",\"-6\",\"15\"],[\"5\",\"Horsham Tigers\",\"6\",\"14\",\"23\",\"-9\",\"13\"],[\"6\",\"Surrey Bisons\",\"6\",\"10\",\"16\",\"-6\",\"10\"],[\"7\",\"Surrey University\",\"6\",\"11\",\"29\",\"-18\",\"6\"]]}", string(actual))
}
