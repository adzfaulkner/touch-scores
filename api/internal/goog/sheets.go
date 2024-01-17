package goog

import (
	"encoding/json"

	"google.golang.org/api/sheets/v4"
)

type BatchGetValues struct {
	SpreadsheetId string `json:"spreadsheetId"`
	ValueRanges   []struct {
		DataFilters []struct {
			A1Range string `json:"a1Range"`
		} `json:"dataFilters"`
		ValueRange struct {
			Values [][]string `json:"values"`
		} `json:"valueRange"`
	} `json:"valueRanges"`
}

type BatchUpdateValues struct {
	TotalUpdatedCells int64
}

type GetSheetValuesFunc func(sid string, rs []string) (*BatchGetValues, error)
type UpdateSheetValuesFunc func(sid string, vrs map[string][][]interface{}) (*BatchUpdateValues, error)

func GetSheetValues(srv *sheets.Service) GetSheetValuesFunc {
	return func(sid string, rs []string) (*BatchGetValues, error) {
		var dfs []*sheets.DataFilter

		for _, v := range rs {
			dfs = append(dfs, &sheets.DataFilter{A1Range: v})
		}

		fs := sheets.BatchGetValuesByDataFilterRequest{
			DataFilters: dfs,
		}

		req := srv.Spreadsheets.Values.BatchGetByDataFilter(
			sid,
			&fs,
		)

		res, err := req.Do()

		if err != nil {
			return nil, err
		}

		raw, _ := res.MarshalJSON()

		var ret BatchGetValues
		err = json.Unmarshal(raw, &ret)

		if err != nil {
			return nil, err
		}

		return &ret, nil
	}
}

func UpdateSheetValues(srv *sheets.Service) UpdateSheetValuesFunc {
	return func(sid string, vrs map[string][][]interface{}) (*BatchUpdateValues, error) {
		var data []*sheets.ValueRange

		for r, v := range vrs {
			vr := &sheets.ValueRange{
				Range:  r,
				Values: v,
			}

			data = append(data, vr)
		}

		ur := sheets.BatchUpdateValuesRequest{
			Data: data,
		}

		req := srv.Spreadsheets.Values.BatchUpdate(
			sid,
			&ur,
		)

		res, err := req.Do()

		if err != nil {
			return nil, err
		}

		ret := BatchUpdateValues{
			TotalUpdatedCells: res.TotalUpdatedCells,
		}

		return &ret, nil
	}
}
