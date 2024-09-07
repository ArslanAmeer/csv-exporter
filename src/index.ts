/**
 * Downloads a CSV file from given JSON data.
 * @param {object[]} data - The JSON data to be converted and downloaded.
 * @param {string} [filename='data'] - The filename for the downloaded CSV file.
 * @param {string[]} [omitProperties=[]] - Array of properties to omit, supports dot notation for nested properties.
 * 
 * 
 * @author Arslan Ameer
 * @see https://www.arslanameer.com
 */
export function downloadCSVFile(data: object[], filename = 'data', omitProperties: string[] = []) {
  // Get headers from the data, excluding omitted properties
  const headers = Object.keys(data[0]).filter(header => !shouldOmit(header, omitProperties));

  // Convert JSON data to CSV format
  const csvData = convertJsonToCSV(data, headers, omitProperties);

  // Create a Blob with the CSV data and appropriate MIME type
  const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });

  // Create a download link
  const dwldLink = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // Check if the browser is Safari
  const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

  if (isSafariBrowser) {
    // If Safari, open in a new window to save the file with a random filename
    dwldLink.setAttribute("target", "_blank");
  }

  // Set download attributes
  dwldLink.setAttribute("href", url);
  dwldLink.setAttribute("download", `${filename}.csv`);
  dwldLink.style.visibility = "hidden";

  // Add the link to the DOM, click it, and remove it
  document.body.appendChild(dwldLink);
  dwldLink.click();
  document.body.removeChild(dwldLink);
}

/**
 * Converts JSON data to CSV format.
 * @param {object[]} objArray - The JSON data to be converted.
 * @param {string[]} headerList - The list of headers for the CSV file.
 * @param {string[]} omitProperties - Array of properties to omit.
 * @returns {string} - The CSV formatted string.
 */
function convertJsonToCSV(objArray: object[], headerList: string[], omitProperties: string[]): string {
  // Ensure objArray is an object array
  const array = typeof objArray !== 'object' ? JSON.parse(objArray as unknown as string) : objArray;

  // Create the header row
  let csv = headerList.map((header, index) => index === 0 ? `S.No,${header}` : header).join(',') + '\r\n';

  // Iterate through the data and create CSV rows
  array.forEach((row: Record<string, any>, rowIndex: number) => {
    const csvRow = headerList.map(header => {
      if (shouldOmit(header, omitProperties)) {
        return '';
      }
      return getNestedProperty(row, header);
    }).join(',');
    csv += `${rowIndex + 1},${csvRow}\r\n`;
  });

  return csv;
}

/**
 * Determines if a property should be omitted based on the omit list.
 * @param {string} property - The property name to check.
 * @param {string[]} omitProperties - The list of properties to omit.
 * @returns {boolean} - True if the property should be omitted, false otherwise.
 */
function shouldOmit(property: string, omitProperties: string[]): boolean {
  return omitProperties.some(omitProp => {
    const regex = new RegExp(`^${omitProp.replace('.', '\\.')}`);
    return regex.test(property);
  });
}

/**
 * Retrieves a nested property value from an object based on dot notation.
 * @param {object} obj - The object to retrieve the property from.
 * @param {string} path - The path to the property in dot notation.
 * @returns {any} - The value of the nested property, or undefined if not found.
 */
function getNestedProperty(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
