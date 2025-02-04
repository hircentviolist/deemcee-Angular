import { Component, OnInit } from '@angular/core';
import { UserPermission } from 'app/model/user-permission';
import { LicenseeService } from '../licensee.service';
import { take, tap } from 'rxjs/operators';
import { TitleService } from 'app/shared/title.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  user: UserPermission;
  data;

  constructor(
    private licenseeService: LicenseeService,
    private titleService: TitleService,
  ) {
    this.titleService.postTitle('All Branches')
    licenseeService.getAllBranches()
      .pipe(
        take(1),
        tap(() => console.log('data retrieved'))
      ).subscribe(
        data => this.data = data,
        error => {
          console.error(error);
          alert('Error Retrieving Branches');
        }
      )
  }

  ngOnInit(): void {
    this.user = {
      display: 'Branch',
      value: 'branch',
      path: ''
    }

  }

}
