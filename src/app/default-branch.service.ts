import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LicenseeService } from './hq/licensee/licensee.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultBranchService {

  defaultBranch$ = new BehaviorSubject<number>(null);

  constructor(private licenseeService: LicenseeService) {
    licenseeService.getBranchForSelect()
    .subscribe(branch => {
      console.log('getBranchForSelect: ', branch);
      this.defaultBranch$.next(branch[0].id)
    })
  }


}
