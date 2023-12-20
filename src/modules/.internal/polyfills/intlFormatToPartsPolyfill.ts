declare global {
  // Extend the NumberFormat interface to include a custom method formatToParts
  interface NumberFormat {
    formatToParts?(number: number): Intl.NumberFormatPart[];
  }
}

// Define a custom structure to represent parts of a formatted number
type CustomNumberFormatPart = {
  type: 'string' | 'integer'; // Define a custom type matching the options
  value: string;
};

// Create a custom enum-like type for the part types
type CustomNumberFormatPartType = 'string' | 'integer';

// Function to map custom type to Intl.NumberFormatPart
function mapToNumberFormatPart(
  parts: CustomNumberFormatPart[],
): Intl.NumberFormatPart[] {
  // Map the custom number format parts to the standard Intl.NumberFormatPart
  return parts.map((part) => ({
    type: part.type as Intl.NumberFormatPartTypes, // Casting the custom type to the standard type
    value: part.value,
  }));
}

// Export a default function for the Intl polyfill
export default function intlFormatToPartsPolyfill() {
  // Check if the Intl object and Intl.NumberFormat function are available
  if (typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function') {
    const numberFormat = new Intl.NumberFormat(); // Create an instance to access the prototype

    // Check if the formatToParts method is not defined
    if (!numberFormat.formatToParts) {
      // Define the formatToParts method as a polyfill for environments that lack it
      Object.defineProperty(numberFormat, 'formatToParts', {
        value: function (number: number): Intl.NumberFormatPart[] {
          // Check if the input is a valid number
          if (typeof number !== 'number') {
            throw new TypeError('Argument should be a valid number');
          }

          // Format the number using the available formatting
          const formattedNumber: string = this.format(number);
          const parts: CustomNumberFormatPart[] = [];

          // Use regex to match string and number parts in the formatted output
          const regex = /(\D+)|(\d+)/g;
          let match;
          while ((match = regex.exec(formattedNumber)) !== null) {
            // Determine the type of the matched part (string or integer)
            const type: CustomNumberFormatPartType = match[1]
              ? 'string'
              : 'integer';
            parts.push({
              type,
              value: match[0],
            });
          }

          // Map the custom parts to standard Intl.NumberFormatPart
          return mapToNumberFormatPart(parts);
        },
        writable: true,
        configurable: true,
      });
    }
  }
}
