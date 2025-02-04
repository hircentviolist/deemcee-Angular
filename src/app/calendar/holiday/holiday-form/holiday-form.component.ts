import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-holiday-form',
  templateUrl: './holiday-form.component.html',
  styleUrls: ['./holiday-form.component.css']
})
export class HolidayFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  initializeForm() {
    // this.holidayForm = new FormGroup({
    //   title: new FormControl('', Validators.required),
    //   start: new FormControl('', Validators.required),
    //   end: new FormControl('', Validators.required)
    // })
  }

}
