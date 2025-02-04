import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from './list/table/table.component';
import { SharedModule } from 'app/shared/shared.module';
import { AdminFormComponent } from './shared/admin-form/admin-form.component';
import { PrincipalFormComponent } from './shared/principal-form/principal-form.component';
import { ManagerTeacherFormComponent } from './shared/manager-teacher-form/manager-teacher-form.component';
import { ParentStudentFormComponent } from './shared/parent-student-form/parent-student-form.component';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    UpdateComponent,
    AdminFormComponent,
    PrincipalFormComponent,
    ManagerTeacherFormComponent,
    ParentStudentFormComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgbNavModule,
    SharedModule,
    NgbModule,
  ],
  providers: [
    LicenseeService
  ]
})
export class UserModule { }
