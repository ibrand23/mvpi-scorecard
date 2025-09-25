// Utility functions for number formatting

/**
 * Formats a number with commas (e.g., 1234567 -> "1,234,567")
 * @param value - The number or string to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: string | number): string => {
  // Remove any non-numeric characters except decimal point
  const numericValue = String(value).replace(/[^\d.]/g, '')
  
  // Split by decimal point if it exists
  const parts = numericValue.split('.')
  
  // Format the integer part with commas
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Return formatted number with decimal part if it exists
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
}

/**
 * Removes commas from a formatted number string
 * @param value - The formatted string to clean
 * @returns Clean numeric string without commas
 */
export const removeCommas = (value: string): string => {
  return value.replace(/,/g, '')
}

/**
 * Formats mileage input as user types
 * @param value - The input value
 * @returns Formatted mileage string
 */
export const formatMileageInput = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '')
  
  // Format with commas
  return formatNumberWithCommas(numericValue)
}
