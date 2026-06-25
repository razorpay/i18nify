package core

import (
	"reflect"
	"testing"
)

func TestUnflattenKeys(t *testing.T) {
	tests := []struct {
		name    string
		input   map[string]any
		opts    *UnflattenOptions
		want    map[string]any
		wantErr bool
	}{
		{
			name: "rebuilds nested maps with default delimiter",
			input: map[string]any{
				"user.name":         "Ada",
				"user.address.city": "London",
			},
			want: map[string]any{
				"user": map[string]any{
					"name": "Ada",
					"address": map[string]any{
						"city": "London",
					},
				},
			},
		},
		{
			name: "supports custom delimiter",
			input: map[string]any{
				"user/profile/city": "Mumbai",
			},
			opts: &UnflattenOptions{Delimiter: "/"},
			want: map[string]any{
				"user": map[string]any{
					"profile": map[string]any{
						"city": "Mumbai",
					},
				},
			},
		},
		{
			name: "replaces non-map intermediates while rebuilding nested values",
			input: map[string]any{
				"user":      "Ada",
				"user.name": "Grace",
			},
			want: map[string]any{
				"user": map[string]any{
					"name": "Grace",
				},
			},
		},
		{
			name:    "returns error for nil input",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := UnflattenKeys(tt.input, tt.opts)
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
				t.Fatalf("UnflattenKeys() = %#v, want %#v", got, tt.want)
			}
		})
	}
}
