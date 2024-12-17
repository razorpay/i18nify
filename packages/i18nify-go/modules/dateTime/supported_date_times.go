package dateTime

import (
	"regexp"
	"time"
)

// DateFormat defines the structure of supported date formats
type DateFormat struct {
	Regex       *regexp.Regexp
	YearIndex   int
	MonthIndex  int
	DayIndex    int
	HourIndex   int
	MinuteIndex int
	SecondIndex int
	Format      string
}

// SupportedDateFormats holds all globally supported date formats
var SupportedDateFormats = []DateFormat{
	// Date formats
	{regexp.MustCompile(`^(\d{4})/(0[1-9]|1[0-2])/(\d{2})$`), 1, 2, 3, 0, 0, 0, "YYYY/MM/DD"},
	{regexp.MustCompile(`^(\d{2})/(0[1-9]|1[0-2])/(\d{4})$`), 3, 2, 1, 0, 0, 0, "DD/MM/YYYY"},
	{regexp.MustCompile(`^(\d{4})\.(0[1-9]|1[0-2])\.(\d{2})$`), 1, 2, 3, 0, 0, 0, "YYYY.MM.DD"},
	{regexp.MustCompile(`^(\d{2})-(0[1-9]|1[0-2])-(\d{4})$`), 3, 2, 1, 0, 0, 0, "DD-MM-YYYY"},
	{regexp.MustCompile(`^(0[1-9]|1[0-2])/(\d{2})/(\d{4})$`), 3, 1, 2, 0, 0, 0, "MM/DD/YYYY"},
	{regexp.MustCompile(`^(\d{4})-(0[1-9]|1[0-2])-(\d{2})$`), 1, 2, 3, 0, 0, 0, "YYYY-MM-DD"},
	{regexp.MustCompile(`^(\d{4})\.\s*(0[1-9]|1[0-2])\.\s*(\d{2})\.\s*$`), 1, 2, 3, 0, 0, 0, "YYYY. MM. DD."},
	{regexp.MustCompile(`^(\d{2})\.(0[1-9]|1[0-2])\.(\d{4})$`), 3, 2, 1, 0, 0, 0, "DD.MM.YYYY"},
	{regexp.MustCompile(`^(0[1-9]|1[0-2])\.(\d{2})\.(\d{4})$`), 3, 1, 2, 0, 0, 0, "MM.DD.YYYY"},

	// Timestamp formats
	{regexp.MustCompile(`^(\d{4})/(0[1-9]|1[0-2])/(\d{2}) (\d{2}):(\d{2}):(\d{2})$`), 1, 2, 3, 4, 5, 6, "YYYY/MM/DD HH:MM:SS"},
	{regexp.MustCompile(`^(\d{2})/(0[1-9]|1[0-2])/(\d{4}) (\d{2}):(\d{2}):(\d{2})$`), 3, 2, 1, 4, 5, 6, "DD/MM/YYYY HH:MM:SS"},
	{regexp.MustCompile(`^(\d{4})-(0[1-9]|1[0-2])-(\d{2}) (\d{2}):(\d{2}):(\d{2})$`), 1, 2, 3, 4, 5, 6, "YYYY-MM-DD HH:MM:SS"},
	{regexp.MustCompile(`^(\d{2})-(0[1-9]|1[0-2])-(\d{4}) (\d{2}):(\d{2}):(\d{2})$`), 3, 2, 1, 4, 5, 6, "DD-MM-YYYY HH:MM:SS"},
	{regexp.MustCompile(`^(\d{4})\.(0[1-9]|1[0-2])\.(\d{2}) (\d{2}):(\d{2}):(\d{2})$`), 1, 2, 3, 4, 5, 6, "YYYY.MM.DD HH:MM:SS"},
	{regexp.MustCompile(`^(\d{2})\.(0[1-9]|1[0-2])\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$`), 3, 2, 1, 4, 5, 6, "DD.MM.YYYY HH:MM:SS"},

	// ISO 8601 Timestamp
	{regexp.MustCompile(`^(\d{4})-(0[1-9]|1[0-2])-(\d{2})T(\d{2}):(\d{2}):(\d{2})$`), 1, 2, 3, 4, 5, 6, "YYYY-MM-DDTHH:MM:SS"},
	// Standard Go
	{nil, 0, 0, 0, 0, 0, 0, time.Layout},           // "01/02 03:04:05PM '06 -0700"
	{nil, 0, 0, 0, 0, 0, 0, time.ANSIC},            // "Mon Jan _2 15:04:05 2006"
	{nil, 0, 0, 0, 0, 0, 0, time.UnixDate},         // "Mon Jan _2 15:04:05 MST 2006"
	{nil, 0, 0, 0, 0, 0, 0, time.RubyDate},         // "Mon Jan 02 15:04:05 -0700 2006"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC822},           // "02 Jan 06 15:04 MST"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC822Z},          // "02 Jan 06 15:04 -0700"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC850},           // "Monday, 02-Jan-06 15:04:05 MST"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC1123},          // "Mon, 02 Jan 2006 15:04:05 MST"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC1123Z},         // "Mon, 02 Jan 2006 15:04:05 -0700"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC3339},          // "2006-01-02T15:04:05Z07:00"
	{nil, 0, 0, 0, 0, 0, 0, time.RFC3339Nano},      // "2006-01-02T15:04:05.999999999Z07:00"
	{nil, 0, 0, 0, 0, 0, 0, time.Kitchen},          // "3:04PM"
	{nil, 0, 0, 0, 0, 0, 0, time.Stamp},            // "Jan _2 15:04:05"
	{nil, 0, 0, 0, 0, 0, 0, time.StampMilli},       // "Jan _2 15:04:05.000"
	{nil, 0, 0, 0, 0, 0, 0, time.StampMicro},       // "Jan _2 15:04:05.000000"
	{nil, 0, 0, 0, 0, 0, 0, time.StampNano},        // "Jan _2 15:04:05.000000000"
	{nil, 0, 0, 0, 0, 0, 0, "2006-01-02 15:04:05"}, // DateTime
	{nil, 0, 0, 0, 0, 0, 0, "2006-01-02"},          // DateOnly
	{nil, 0, 0, 0, 0, 0, 0, "15:04:05"},            // TimeOnly
}
