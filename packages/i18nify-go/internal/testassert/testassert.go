package testassert

import (
	"encoding/json"
	"fmt"
	"math"
	"reflect"
	"strings"
	"testing"
)

func message(msgAndArgs ...interface{}) string {
	if len(msgAndArgs) == 0 {
		return ""
	}
	if format, ok := msgAndArgs[0].(string); ok {
		if len(msgAndArgs) > 1 {
			return fmt.Sprintf(format, msgAndArgs[1:]...)
		}
		return format
	}
	return fmt.Sprint(msgAndArgs...)
}

func fail(t *testing.T, defaultMsg string, msgAndArgs ...interface{}) {
	t.Helper()
	if msg := message(msgAndArgs...); msg != "" {
		t.Error(msg)
		return
	}
	t.Error(defaultMsg)
}

func NoError(t *testing.T, err error, msgAndArgs ...interface{}) {
	t.Helper()
	if err != nil {
		fail(t, fmt.Sprintf("expected no error, got %v", err), msgAndArgs...)
	}
}

func RequireNoError(t *testing.T, err error, msgAndArgs ...interface{}) {
	t.Helper()
	if err != nil {
		if msg := message(msgAndArgs...); msg != "" {
			t.Fatal(msg)
			return
		}
		t.Fatalf("expected no error, got %v", err)
	}
}

func Error(t *testing.T, err error, msgAndArgs ...interface{}) {
	t.Helper()
	if err == nil {
		fail(t, "expected an error, got nil", msgAndArgs...)
	}
}

func Equal(t *testing.T, expected, actual interface{}, msgAndArgs ...interface{}) {
	t.Helper()
	if !reflect.DeepEqual(expected, actual) {
		fail(t, fmt.Sprintf("expected %v, got %v", expected, actual), msgAndArgs...)
	}
}

func EqualError(t *testing.T, err error, expected string, msgAndArgs ...interface{}) {
	t.Helper()
	if err == nil {
		fail(t, fmt.Sprintf("expected error %q, got nil", expected), msgAndArgs...)
		return
	}
	if err.Error() != expected {
		fail(t, fmt.Sprintf("expected error %q, got %q", expected, err.Error()), msgAndArgs...)
	}
}

func True(t *testing.T, value bool, msgAndArgs ...interface{}) {
	t.Helper()
	if !value {
		fail(t, "expected true, got false", msgAndArgs...)
	}
}

func False(t *testing.T, value bool, msgAndArgs ...interface{}) {
	t.Helper()
	if value {
		fail(t, "expected false, got true", msgAndArgs...)
	}
}

func Empty(t *testing.T, value interface{}, msgAndArgs ...interface{}) {
	t.Helper()
	v := reflect.ValueOf(value)
	switch v.Kind() {
	case reflect.Invalid:
		return
	case reflect.String, reflect.Array, reflect.Slice, reflect.Map:
		if v.Len() != 0 {
			fail(t, fmt.Sprintf("expected empty value, got %v", value), msgAndArgs...)
		}
	default:
		zero := reflect.Zero(v.Type()).Interface()
		if !reflect.DeepEqual(value, zero) {
			fail(t, fmt.Sprintf("expected empty value, got %v", value), msgAndArgs...)
		}
	}
}

func NotEmpty(t *testing.T, value interface{}, msgAndArgs ...interface{}) {
	t.Helper()
	v := reflect.ValueOf(value)
	switch v.Kind() {
	case reflect.Invalid:
		fail(t, "expected non-empty value, got invalid", msgAndArgs...)
	case reflect.String, reflect.Array, reflect.Slice, reflect.Map:
		if v.Len() == 0 {
			fail(t, "expected non-empty value, got empty", msgAndArgs...)
		}
	default:
		zero := reflect.Zero(v.Type()).Interface()
		if reflect.DeepEqual(value, zero) {
			fail(t, "expected non-empty value, got zero value", msgAndArgs...)
		}
	}
}

func NotNil(t *testing.T, value interface{}, msgAndArgs ...interface{}) {
	t.Helper()
	if value == nil {
		fail(t, "expected non-nil value, got nil", msgAndArgs...)
		return
	}
	v := reflect.ValueOf(value)
	switch v.Kind() {
	case reflect.Chan, reflect.Func, reflect.Interface, reflect.Map, reflect.Pointer, reflect.Slice:
		if v.IsNil() {
			fail(t, "expected non-nil value, got nil", msgAndArgs...)
		}
	}
}

func Contains(t *testing.T, container interface{}, item interface{}, msgAndArgs ...interface{}) {
	t.Helper()
	switch c := container.(type) {
	case string:
		s, ok := item.(string)
		if !ok || !strings.Contains(c, s) {
			fail(t, fmt.Sprintf("expected %q to contain %q", c, item), msgAndArgs...)
		}
		return
	}
	v := reflect.ValueOf(container)
	if v.Kind() == reflect.Slice || v.Kind() == reflect.Array {
		for i := 0; i < v.Len(); i++ {
			if reflect.DeepEqual(v.Index(i).Interface(), item) {
				return
			}
		}
	}
	fail(t, fmt.Sprintf("expected %v to contain %v", container, item), msgAndArgs...)
}

func InDelta(t *testing.T, expected, actual, delta float64, msgAndArgs ...interface{}) {
	t.Helper()
	if math.Abs(expected-actual) > delta {
		fail(t, fmt.Sprintf("expected %v and %v to differ by no more than %v", expected, actual, delta), msgAndArgs...)
	}
}

func JSONEq(t *testing.T, expected, actual string, msgAndArgs ...interface{}) {
	t.Helper()
	var expectedValue interface{}
	var actualValue interface{}
	if err := json.Unmarshal([]byte(expected), &expectedValue); err != nil {
		fail(t, fmt.Sprintf("invalid expected JSON: %v", err), msgAndArgs...)
		return
	}
	if err := json.Unmarshal([]byte(actual), &actualValue); err != nil {
		fail(t, fmt.Sprintf("invalid actual JSON: %v", err), msgAndArgs...)
		return
	}
	if !reflect.DeepEqual(expectedValue, actualValue) {
		fail(t, "expected JSON documents to be equal", msgAndArgs...)
	}
}
