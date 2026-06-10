package i18n

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestFlattenKeys_Basic(t *testing.T) {
	input := map[string]any{"a": map[string]any{"b": "x"}}
	got, err := FlattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a.b": "x"}, got)
}

func TestFlattenKeys_DeepNesting(t *testing.T) {
	input := map[string]any{"a": map[string]any{"b": map[string]any{"c": "deep"}}}
	got, err := FlattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a.b.c": "deep"}, got)
}

func TestFlattenKeys_TopLevelLeaves(t *testing.T) {
	input := map[string]any{"greeting": "hello", "farewell": "bye"}
	got, err := FlattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, input, got)
}

func TestFlattenKeys_MessageBundle(t *testing.T) {
	input := map[string]any{
		"auth": map[string]any{
			"login": map[string]any{"title": "Sign in", "submit": "Log in"},
			"error": "Invalid credentials",
		},
		"common": map[string]any{"ok": "OK", "cancel": "Cancel"},
	}
	got, err := FlattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{
		"auth.login.title":  "Sign in",
		"auth.login.submit": "Log in",
		"auth.error":        "Invalid credentials",
		"common.ok":         "OK",
		"common.cancel":     "Cancel",
	}, got)
}

func TestFlattenKeys_ArrayIsLeaf(t *testing.T) {
	input := map[string]any{"tags": []any{"a", "b"}}
	got, err := FlattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, input, got)
}

func TestFlattenKeys_CustomDelimiter(t *testing.T) {
	input := map[string]any{"a": map[string]any{"b": "x"}}
	got, err := FlattenKeys(input, FlattenOptions{Delimiter: "/"})
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a/b": "x"}, got)
}

func TestFlattenKeys_EmptyInput(t *testing.T) {
	got, err := FlattenKeys(map[string]any{})
	require.NoError(t, err)
	assert.Equal(t, map[string]any{}, got)
}

func TestFlattenKeys_NilInput(t *testing.T) {
	_, err := FlattenKeys(nil)
	assert.Error(t, err)
}

func TestUnflattenKeys_Basic(t *testing.T) {
	input := map[string]any{"a.b": "x"}
	got, err := UnflattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a": map[string]any{"b": "x"}}, got)
}

func TestUnflattenKeys_DeepNesting(t *testing.T) {
	input := map[string]any{"a.b.c": "deep"}
	got, err := UnflattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a": map[string]any{"b": map[string]any{"c": "deep"}}}, got)
}

func TestUnflattenKeys_SiblingKeys(t *testing.T) {
	input := map[string]any{"a.b": "1", "a.c": "2"}
	got, err := UnflattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a": map[string]any{"b": "1", "c": "2"}}, got)
}

func TestUnflattenKeys_MessageBundle(t *testing.T) {
	input := map[string]any{
		"auth.login.title":  "Sign in",
		"auth.login.submit": "Log in",
		"auth.error":        "Invalid credentials",
		"common.ok":         "OK",
		"common.cancel":     "Cancel",
	}
	got, err := UnflattenKeys(input)
	require.NoError(t, err)
	assert.Equal(t, map[string]any{
		"auth": map[string]any{
			"login": map[string]any{"title": "Sign in", "submit": "Log in"},
			"error": "Invalid credentials",
		},
		"common": map[string]any{"ok": "OK", "cancel": "Cancel"},
	}, got)
}

func TestUnflattenKeys_CustomDelimiter(t *testing.T) {
	input := map[string]any{"a/b": "x"}
	got, err := UnflattenKeys(input, UnflattenOptions{Delimiter: "/"})
	require.NoError(t, err)
	assert.Equal(t, map[string]any{"a": map[string]any{"b": "x"}}, got)
}

func TestUnflattenKeys_EmptyInput(t *testing.T) {
	got, err := UnflattenKeys(map[string]any{})
	require.NoError(t, err)
	assert.Equal(t, map[string]any{}, got)
}

func TestUnflattenKeys_NilInput(t *testing.T) {
	_, err := UnflattenKeys(nil)
	assert.Error(t, err)
}

func TestFlattenUnflatten_RoundTrip(t *testing.T) {
	original := map[string]any{
		"auth": map[string]any{
			"login": map[string]any{"title": "Sign in"},
			"error": "Oops",
		},
		"common": map[string]any{"ok": "OK"},
	}
	flat, err := FlattenKeys(original)
	require.NoError(t, err)
	restored, err := UnflattenKeys(flat)
	require.NoError(t, err)
	assert.Equal(t, original, restored)
}
