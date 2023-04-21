/**
 * Downloads a CSV file from given JSON data.
 * @param {object[]} data - The JSON data to be converted and downloaded.
 * @param {string} [filename='data'] - The filename for the downloaded CSV file.
 */
export function downloadCSVFile(data: object[], filename = 'data') {
    // Get headers from the data
    const headers = Object.keys(data[0]);
  
    // Convert JSON data to CSV format
    const csvData = convertJsonToCSV(data, headers);
  
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
   * @returns {string} - The CSV formatted string.
   */
  function convertJsonToCSV(objArray: object[], headerList: string[]): string {
    // Ensure objArray is an object array
    const array = typeof objArray !== 'object' ? JSON.parse(objArray as unknown as string) : objArray;
  
    // Create the header row
    let csv = headerList.map((header, index) => index === 0 ? `S.No,${header}` : header).join(',') + '\r\n';
  
    // Iterate through the data and create CSV rows
    array.forEach((row: Record<string, any>, rowIndex: number) => {
      csv += `${rowIndex + 1},${headerList.map(header => row[header]).join(',')}\r\n`;
    });
  
    return csv;
  }
  