package dateTime

import "testing"

func TestGetWeekdaysLong(t *testing.T) {
	weekdays := GetWeekdays(long)
	expectedWeekdays := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}

	for i, weekday := range weekdays {
		if weekday != expectedWeekdays[i] {
			t.Errorf("expected '%s', got '%s'", expectedWeekdays[i], weekday)
		}
	}
}

func TestGetWeekdaysShort(t *testing.T) {
	weekdays := GetWeekdays(short)
	expectedWeekdays := []string{"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}

	for i, weekday := range weekdays {
		if weekday != expectedWeekdays[i] {
			t.Errorf("expected '%s', got '%s'", expectedWeekdays[i], weekday)
		}
	}
}
func TestGetWeekdaysNarrow(t *testing.T) {
	weekdays := GetWeekdays(narrow)
	expectedWeekdays := []string{"S", "M", "T", "W", "T", "F", "S"}

	for i, weekday := range weekdays {
		if weekday != expectedWeekdays[i] {
			t.Errorf("expected '%s', got '%s'", expectedWeekdays[i], weekday)
		}
	}
}
