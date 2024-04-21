package fixture_aggregate

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_IsDateValue(t *testing.T) {
	t.Parallel()

	assert.True(t, isDateValue("Monday"))
	assert.True(t, isDateValue("monday"))
	assert.False(t, isDateValue(""))
}

func Test_IsTimeValue(t *testing.T) {
	t.Parallel()

	assert.True(t, isTimeValue("09:30"))
	assert.True(t, isTimeValue("17:30"))
	assert.False(t, isTimeValue(""))
}

func Test_IsPitchValue(t *testing.T) {
	t.Parallel()

	assert.True(t, isPitchValue("Field"))
	assert.True(t, isPitchValue("field"))
	assert.False(t, isTimeValue(""))
}

func Test_ColumnToLetter(t *testing.T) {
	t.Parallel()

	assert.Equal(t, "A", columnToLetter(0))
	assert.Equal(t, "Z", columnToLetter(25))
	assert.Equal(t, "AA", columnToLetter(26))
	assert.Equal(t, "AB", columnToLetter(27))
}

func Test_NormalizeDate(t *testing.T) {
	t.Parallel()

	sut := normalizerDate("1970")

	assert.Equal(t, "2 December 1970", sut("2nd December"))
	assert.Equal(t, "2 December 1975", sut("2nd December 1975"))
	assert.Equal(t, "2 December 1978", sut("2 December 1978"))
}

func Test_NormalizeRefName(t *testing.T) {
	t.Parallel()

	assert.Equal(t, "JOE BLOGGS", normalizeRefName("joe bloggs"))
	assert.Equal(t, "JOE BLOGGS", normalizeRefName("Joe Bloggs"))
}

func Test_PlucKValues(t *testing.T) {
	t.Parallel()

	subject := [][]string{
		{"testing"},
	}

	assert.Equal(t, "", pluckValue([][]string{}, 0, 0))
	assert.Equal(t, "testing", pluckValue(subject, 0, 0))
	assert.Equal(t, "", pluckValue(subject, 1, 0))
	assert.Equal(t, "", pluckValue(subject, 1, 1))
	assert.Equal(t, "", pluckValue(subject, 1, 0))
}

func Test_ExtractSheetAndReadFromFromRange(t *testing.T) {
	t.Parallel()

	sheet, fromCell := extractSheetAndReadFromFromRange("Schedule!A11:B11")

	assert.Equal(t, "Schedule", sheet)
	assert.Equal(t, 11, fromCell)

	sheet, fromCell = extractSheetAndReadFromFromRange("A11:B11")

	assert.Equal(t, "", sheet)
	assert.Equal(t, 11, fromCell)

	sheet, fromCell = extractSheetAndReadFromFromRange("")

	assert.Equal(t, "", sheet)
	assert.Equal(t, -1, fromCell)
}
