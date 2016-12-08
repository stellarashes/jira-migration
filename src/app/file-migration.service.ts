import {Injectable} from '@angular/core';

declare let Papa: any;

@Injectable()
export class FileMigrationService {

  constructor() {
  }

  public migrate(input: File): Promise<String> {
    return new Promise<String>((resolve, reject) => {
      Papa.parse(input, {
        complete: result => {
          try {
            let processed = this.process(result.data);
            resolve(processed);
          } catch (e) {
            reject(e);
          }
        }
      })
    });
  }

  private process(result) {
    if (!result || !result.length) {
      throw new Error('CSV file empty or could not be read');
    }

    let header = result[0];
    let descriptionIndex = -1;
    for (let i = 0; i < header.length; i++) {
      if (header[i].toLowerCase() === 'description') {
        descriptionIndex = i;
        break;
      }
    }

    if (descriptionIndex === -1) {
      throw new Error('Could not find description header');
    }

    for (let i = 1; i < result.length; i++) {
      let line = result[i];
      if (line.length > descriptionIndex) {
        line[descriptionIndex] = this.removeMarkup(line[descriptionIndex]);
      }
    }

    return result;
  }

  private removeMarkup(description) {
    return description.replace(/<(?:.|\n)*?>/gm, '');
  }

}
