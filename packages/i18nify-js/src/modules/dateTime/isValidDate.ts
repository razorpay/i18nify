import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Checks if a given string is a valid date according to a specific locale's date format.
 *
 * @param dateString The date string to validate.
 * @returns True if the dateString is a valid date according to the locale's format, false otherwise.
 */
const isValidDate = (dateString: string): boolean => {
 // Try to parse the date string using the Date object
 const date = new Date(dateString);
 // Check if the date is an invalid Date object (e.g., new Date('invalid') -> NaN)
 if (isNaN(date.getTime())) {
   return false; // The date is invalid
 } else {
   // Use Intl.DateTimeFormat to format the date back to a string
   const formattedDateStr = new Intl.DateTimeFormat('en-IN', {
     year: 'numeric',
     month: 'numeric',
     day: 'numeric'
   }).format(date);

   // Create a date string for comparison in YYYY-MM-DD format
   // This step is necessary because the input format should match the expected format
   const [day, month, year] = formattedDateStr.split('/');
   const formattedInputDate = `${year}-${month}-${day}`;
   const inputedDate = `${new Date(dateString).getFullYear()}-${new Date(dateString).getMonth()+1}-${new Date(dateString).getDate()}`;

   // Compare the formatted date with the original date string
   return inputedDate === formattedInputDate;
 }
};

export default withErrorBoundary<typeof isValidDate>(isValidDate);
