import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicenseeRoutingModule } from './licensee-routing.module';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { LicenseeService } from './licensee.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ListComponent, AddComponent, UpdateComponent],
  imports: [
    CommonModule,
    LicenseeRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
  ],
  providers: [LicenseeService]
})
export class LicenseeModule { }
