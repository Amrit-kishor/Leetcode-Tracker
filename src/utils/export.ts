/**
 * Utility functions for exporting data to CSV and JSON formats.
 */

/**
 * Downloads data as a CSV file.
 * @param headers CSV header column labels
 * @param rows Two-dimensional array of row values
 * @param filename File name without extension
 */
export function exportToCSV(headers: string[], rows: any[][], filename: string) {
  const content = [
    headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","),
    ...rows.map(row => 
      row.map(val => `"${String(val !== null && val !== undefined ? val : "").replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads data as a JSON file.
 * @param data Object or array to export
 * @param filename File name without extension
 */
export function exportToJSON(data: any, filename: string) {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
