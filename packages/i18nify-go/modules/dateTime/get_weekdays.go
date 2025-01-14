package dateTime

import "time"

type WeekDayType string

const (
	long   WeekDayType = "long"
	short  WeekDayType = "short"
	narrow WeekDayType = "narrow"
)

// GetWeekdays returns an array of weekday names starting from Sunday.
func GetWeekdays(weekDayType WeekDayType) []string {
	var weekdays []string
	// Jan 4, 1970, is a Sunday
	startDate := time.Date(1970, 1, 4, 0, 0, 0, 0, time.UTC)
	switch weekDayType {
	case short:
		for i := 0; i < 7; i++ {
			currentDay := startDate.AddDate(0, 0, i)
			weekdays = append(weekdays, currentDay.Format("Mon"))
		}
		break
	case narrow:
		return []string{"S", "M", "T", "W", "T", "F", "S"}
	default:
		for i := 0; i < 7; i++ {
			weekdays = append(weekdays, startDate.AddDate(0, 0, i).Weekday().String())
		}
	}
	return weekdays
}
