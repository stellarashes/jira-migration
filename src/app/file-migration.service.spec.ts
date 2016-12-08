/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileMigrationService } from './file-migration.service';

describe('Service: FileMigration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileMigrationService]
    });
  });

  it('should ...', inject([FileMigrationService], (service: FileMigrationService) => {
    expect(service).toBeTruthy();
  }));
});
