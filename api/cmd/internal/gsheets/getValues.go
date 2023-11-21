package gsheets

import (
	"github.com/adzfaulkner/touch-scores/internal/goog"
)

type Values struct {
	SpreadsheetId string
	Values        map[string][][]string
}

func GetValues(getSheetVals goog.GetSheetValuesFunc, sid string, ranges []string) (*Values, error) {
	resp, err := getSheetVals(sid, ranges)

	if err != nil {
		return nil, err
	}

	vals := map[string][][]string{}
	for _, v := range resp.ValueRanges {
		vals[v.DataFilters[0].A1Range] = v.ValueRange.Values
	}

	msg := Values{
		SpreadsheetId: resp.SpreadsheetId,
		Values:        vals,
	}

	return &msg, nil
}
