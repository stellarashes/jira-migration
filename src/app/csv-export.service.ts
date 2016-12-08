import { Injectable } from '@angular/core';

@Injectable()
export class CsvExportService {

  constructor() { }

  private modifyFileName(filename) {
    let dotIndex = filename.lastIndexOf('.');
    let append = '_markup_removed';
    if (dotIndex === -1) {
      return filename + append;
    } else {
      return filename.substr(0, dotIndex) + append + filename.substr(dotIndex);
    }
  }

  // function pulled from http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
  public exportToCsv(filename, rows) {
    filename = this.modifyFileName(filename);
    let processRow = function (row) {
      let finalVal = '';
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null ? '' : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
        if (j > 0)
          finalVal += ',';
        finalVal += result;
      }
      return finalVal + '\n';
    };

    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    let blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      let link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

}
