package date_time

var timezoneMapping = map[string]string{
	"UTC":   "UTC",
	"GMT":   "UTC",
	"EST":   "America/New_York",    // Eastern Standard Time
	"PST":   "America/Los_Angeles", // Pacific Standard Time
	"CST":   "America/Chicago",     // Central Standard Time
	"MST":   "America/Denver",      // Mountain Standard Time
	"IST":   "Asia/Kolkata",        // Indian Standard Time
	"JST":   "Asia/Tokyo",          // Japan Standard Time
	"BST":   "Europe/London",       // British Summer Time
	"AEST":  "Australia/Sydney",    // Australian Eastern Standard Time
	"ACST":  "Australia/Adelaide",  // Australian Central Standard Time
	"NZST":  "Pacific/Auckland",    // New Zealand Standard Time
	"CEST":  "Europe/Berlin",       // Central European Summer Time
	"CET":   "Europe/Paris",        // Central European Time
	"EET":   "Africa/Cairo",        // Eastern European Time
	"ART":   "Africa/Abidjan",      // Argentina Time (rarely used)
	"MSK":   "Europe/Moscow",       // Moscow Time
	"SGT":   "Asia/Singapore",      // Singapore Time
	"ADT":   "America/Halifax",     // Atlantic Daylight Time
	"AKDT":  "America/Anchorage",   // Alaska Daylight Time
	"HST":   "Pacific/Honolulu",    // Hawaii Standard Time
	"AKST":  "America/Anchorage",   // Alaska Standard Time
	"WET":   "Europe/Lisbon",       // Western European Time
	"AST":   "America/Caracas",     // Atlantic Standard Time
	"MSD":   "Europe/Moscow",       // Moscow Daylight Time
	"GMT+2": "Africa/Harare",       // GMT+2 (Zimbabwe, Central Africa)
	"CCT":   "Asia/Shanghai",       // China Standard Time
}
