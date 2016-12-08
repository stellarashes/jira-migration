import {Component, HostListener, ElementRef, OnInit} from '@angular/core';
import {FileMigrationService} from "./file-migration.service";
import {CsvExportService} from "./csv-export.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileMigrationService, CsvExportService]
})
export class AppComponent implements OnInit{
  error: String;
  hover: boolean;
  container: Element;

  constructor(private migrationService: FileMigrationService,
              private exportService: CsvExportService) {

  }

  ngOnInit() {
    this.container = document.getElementById('file-drop-div');
  }

  public devNull(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  public enter(e) {
    this.hover = true;
    return this.devNull(e);
  }

  public leave(e) {
    if (!this.isDescendent(this.container, e.target)) {
      this.hover = false;
    }
    return this.devNull(e);
  }

  private isDescendent(parent, child) {
    let node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  public drop(e: DragEvent) {
    this.hover = false;
    this.devNull(e);
    e.dataTransfer.dropEffect = 'copy';
    let files = e.dataTransfer.files;
    this.handleFiles(this.convertFileList(files));
  }

  private convertFileList(list: FileList): File[] {
    let ret: File[] = [];
    for (let i = 0; i < list.length; i++) {
      ret.push(list.item(i));
    }

    return ret;
  }

  public fileSelect(e) {
    let files = e.target.files;
    this.handleFiles(files);
  }

  private handleFiles(files: File[]) {
    if (!files) return;
    for (let file of files) {
      if (file.type !== 'text/csv') {
        this.error = `File ${file.name} is not a csv file`;
        return;
      }

      this.migrationService.migrate(file)
        .then(result => {
          this.error = null;
          this.exportService.exportToCsv(file.name, result)
        })
        .catch(error => {
          this.error = error;
          console.error(error)
        });
    }
  }
}
