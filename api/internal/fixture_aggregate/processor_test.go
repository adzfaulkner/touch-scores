package fixture_aggregate

import (
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func Test_Processor(t *testing.T) {
	t.Parallel()

	raw, err := os.ReadFile("./data/seds_24_25_r1_fixture.json")

	if err != nil {
		fmt.Println(err)
	}

	expected, err := os.ReadFile("./data/seds_24_25_r1_expected.json")

	if err != nil {
		fmt.Println(err)
	}

	var ts testSubject

	err = json.Unmarshal(raw, &ts)

	if err != nil {
		fmt.Println(err)
	}

	res := Processor(ts.Data)

	actual, _ := json.Marshal(res)

	assert.Equal(t, string(expected), string(actual))
}
