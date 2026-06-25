package core

import (
	"reflect"
	"testing"
)

func TestFlattenKeys(t *testing.T) {
	tests := []struct {
		name    string
		input   map[string]any
		opts    *FlattenOptions
		want    map[string]any
		wantErr bool
	}{
		{
			name: "flattens nested maps with default delimiter",
			input: map[string]any{
				"user": map[string]any{
					"name": "Ada",
					"address": map[string]any{
						"city": "London",
					},
				},
			},
			want: map[string]any{
				"user.name":         "Ada",
				"user.address.city": "London",
			},
		},
		{
			name: "preserves arrays as leaf values",
			input: map[string]any{
				"user": map[string]any{
					"aliases": []string{"Ada", "Lovelace"},
				},
			},
			want: map[string]any{
				"user.aliases": []string{"Ada", "Lovelace"},
			},
		},
		{
			name: "supports custom delimiter",
			input: map[string]any{
				"user": map[string]any{
					"profile": map[string]any{
						"city": "Mumbai",
					},
				},
			},
			opts: &FlattenOptions{Delimiter: "/"},
			want: map[string]any{
				"user/profile/city": "Mumbai",
			},
		},
		{
			name:    "returns error for nil input",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := FlattenKeys(tt.input, tt.opts)
			if tt.wantErr {
				if err == nil {
					t.Fatal("expected an error but got nil")
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Fatalf("FlattenKeys() = %#v, want %#v", got, tt.want)
			}
		})
	}
}
