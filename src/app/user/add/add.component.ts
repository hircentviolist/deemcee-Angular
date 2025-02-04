import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/shared/title.service';
import { AuthService } from 'app/auth/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  title: string;
  options: Array<{value: string; display: string}>
  userType: string;

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.paramMap
    .pipe(
      map(param => param.get('userType')),
      take(1)
    ).subscribe(
      u => this.userType = u
    )
  }

  ngOnInit(): void {
    this.title = `Add ${this.userType}`;
    this.titleService.postTitle(this.title);
  }

  onSubmit() {
  }

  // onSelect(e) {
  //   this.userType = e.target.value
  // }

}
