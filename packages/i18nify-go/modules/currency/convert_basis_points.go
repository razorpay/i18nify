package currency

import (
	"fmt"
	"math"
)

// ConvertBasisPointsToPercent converts a basis-points value to its percentage equivalent.
//
// One basis point equals one-hundredth of a percentage point (0.01%).
// Example: 250 bps → 2.5 (i.e. 2.50%).
func ConvertBasisPointsToPercent(basisPoints float64) (float64, error) {
	if math.IsNaN(basisPoints) || math.IsInf(basisPoints, 0) {
		return 0, fmt.Errorf("basisPoints must be a finite number, received: %v", basisPoints)
	}
	return basisPoints / 100, nil
}

// ConvertPercentToBasisPoints converts a percentage value to its basis-points equivalent.
//
// One basis point equals one-hundredth of a percentage point (0.01%).
// Example: 2.5 (i.e. 2.50%) → 250 bps.
func ConvertPercentToBasisPoints(percent float64) (float64, error) {
	if math.IsNaN(percent) || math.IsInf(percent, 0) {
		return 0, fmt.Errorf("percent must be a finite number, received: %v", percent)
	}
	return percent * 100, nil
}
