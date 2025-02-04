import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-past-enrolment',
  templateUrl: './past-enrolment.component.html',
  styleUrls: ['./past-enrolment.component.css']
})
export class PastEnrolmentComponent implements OnInit {

  constructor(
    public location: Location
  ) { }

  ngOnInit(): void {
  }

}
