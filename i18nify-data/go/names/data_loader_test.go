package names

import "testing"

func TestGetNamesData(t *testing.T) {
	d, err := GetNamesData()
	if err != nil {
		t.Fatalf("GetNamesData() error = %v", err)
	}
	if d == nil {
		t.Fatal("GetNamesData() returned nil")
	}
	if d.NamesInformation.ValidationRules.MinLength != 2 {
		t.Fatalf("MinLength = %d, want 2", d.NamesInformation.ValidationRules.MinLength)
	}
	if d.NamesInformation.ValidationRules.MaxLength != 100 {
		t.Fatalf("MaxLength = %d, want 100", d.NamesInformation.ValidationRules.MaxLength)
	}
	if len(d.NamesInformation.HonorificTitles["english"]) == 0 {
		t.Fatal("expected english honorific titles")
	}
}

func TestGetNamesData_Idempotent(t *testing.T) {
	d1, err1 := GetNamesData()
	d2, err2 := GetNamesData()

	if err1 != nil || err2 != nil {
		t.Fatalf("GetNamesData() errors = %v, %v", err1, err2)
	}
	if d1 != d2 {
		t.Error("GetNamesData() must return the same cached pointer on repeated calls")
	}
}
