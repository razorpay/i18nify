package banking

import "testing"

func TestNormalizeIFSC(t *testing.T) {
	tests := []struct {
		name    string
		ifsc    string
		want    string
		wantErr bool
	}{
		{
			name: "trims and uppercases valid IFSC",
			ifsc: "  hdfc0001234  ",
			want: "HDFC0001234",
		},
		{
			name: "preserves normalized IFSC",
			ifsc: "SBIN0000001",
			want: "SBIN0000001",
		},
		{
			name:    "rejects empty IFSC",
			ifsc:    "",
			wantErr: true,
		},
		{
			name:    "rejects invalid IFSC format",
			ifsc:    "HDFC1001234",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := NormalizeIFSC(tt.ifsc)
			if tt.wantErr {
				if err == nil {
					t.Fatalf("NormalizeIFSC(%q) expected error", tt.ifsc)
				}
				return
			}
			if err != nil {
				t.Fatalf("NormalizeIFSC(%q) unexpected error: %v", tt.ifsc, err)
			}
			if got != tt.want {
				t.Fatalf("NormalizeIFSC(%q) = %q, want %q", tt.ifsc, got, tt.want)
			}
		})
	}
}
