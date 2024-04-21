package fixture_aggregate

func filterStandings(raw [][]string) [][]string {
	res := [][]string{
		{},
	}

	var pluckValues []int

	for i := 0; i < len(raw[0]); i++ {
		if val := pluckValue(raw, 0, i); len(val) >= 2 {
			pluckValues = append(pluckValues, i)
			res[0] = append(res[0], val)
		}
	}

	for r := 1; r < len(raw); r++ {
		if pluckValue(raw, r, 0) == "" {
			continue
		}

		res = append(res, []string{})
		for _, c := range pluckValues {
			res[len(res)-1] = append(res[len(res)-1], pluckValue(raw, r, c))
		}
	}

	return res
}
