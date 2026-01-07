// CODE GENERATED. DO NOT EDIT.
package country_subdivisions

import (
	"encoding/json"
	"testing"
)

// TestGetCountrySubdivisions_SerializationDeserialization tests that data can be successfully
// serialized to JSON and deserialized back without data loss or corruption.
// This test verifies the serialization/deserialization round-trip works correctly
// for country subdivisions data loaded by country code.
func TestGetCountrySubdivisions_SerializationDeserialization(t *testing.T) {
	// Test with a known country code (e.g., "IN" for India)
	testCountryCode := "IN"
	
	// Get original data from embedded filesystem
	originalData, err := GetCountrySubdivisions(testCountryCode)
	if err != nil {
		t.Fatalf("GetCountrySubdivisions(%q) failed: %v", testCountryCode, err)
	}
	
	if originalData == nil {
		t.Fatal("GetCountrySubdivisions() returned nil, expected country subdivisions data")
	}
	
	// Serialize to JSON
	jsonBytes, err := json.Marshal(originalData)
	if err != nil {
		t.Fatalf("Failed to marshal data: %v", err)
	}
	
	// Deserialize back from JSON
	var deserializedData CountrySubdivisions
	if err := json.Unmarshal(jsonBytes, &deserializedData); err != nil {
		t.Fatalf("Failed to unmarshal data: %v", err)
	}
	
	// Verify that country name matches
	if deserializedData.CountryName != originalData.CountryName {
		t.Errorf("Deserialized country name = %q, want %q", 
			deserializedData.CountryName, originalData.CountryName)
	}
	
	// Verify that states count matches
	if len(deserializedData.States) != len(originalData.States) {
		t.Errorf("Deserialized states count = %d, want %d", 
			len(deserializedData.States), len(originalData.States))
	}
	
	// Verify that all state keys from original exist in deserialized and vice versa
	for key := range originalData.States {
		if _, exists := deserializedData.States[key]; !exists {
			t.Errorf("State key %q exists in original but not in deserialized data", key)
		}
	}
	
	for key := range deserializedData.States {
		if _, exists := originalData.States[key]; !exists {
			t.Errorf("State key %q exists in deserialized but not in original data", key)
		}
	}
	
	// Re-serialize both to JSON and compare bytes to ensure structural equality
	originalBytes, err := json.Marshal(originalData)
	if err != nil {
		t.Errorf("Failed to marshal original: %v", err)
	}
	
	deserializedBytes, err := json.Marshal(&deserializedData)
	if err != nil {
		t.Errorf("Failed to marshal deserialized: %v", err)
	}
	
	// Compare JSON representations (normalized)
	var originalJSON, deserializedJSON interface{}
	if err := json.Unmarshal(originalBytes, &originalJSON); err != nil {
		t.Errorf("Failed to unmarshal original JSON: %v", err)
	}
	if err := json.Unmarshal(deserializedBytes, &deserializedJSON); err != nil {
		t.Errorf("Failed to unmarshal deserialized JSON: %v", err)
	}
	
	// Re-marshal both to normalized JSON for comparison
	originalNormalized, _ := json.Marshal(originalJSON)
	deserializedNormalized, _ := json.Marshal(deserializedJSON)
	
	if string(originalNormalized) != string(deserializedNormalized) {
		t.Errorf("Data mismatch after round-trip serialization")
	}
}

