import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { ShowComponent } from './show/show.component';
import { ListComponent } from './list/list.component';
import {VideoAssignmentDetailsComponent} from './video-assignment-details/video-assignment-details.component';
import { PastEnrolmentComponent } from './show/past-enrolment/past-enrolment.component';


const routes: Routes = [
  {path: 'new', component: NewComponent},
  {path: 'show/:id', component: ShowComponent},
  {path: 'show/:id/:status', component: PastEnrolmentComponent},
  {path: 'video/:id', component: VideoAssignmentDetailsComponent},
  {path: 'list', component: ListComponent},
  {path: '', pathMatch: 'full', redirectTo: 'list'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentRoutingModule { }
