import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AnnouncementRoutes} from './announcement.routing';
import {AnnouncementComponent} from './announcement.component';
import { CreateAnnouncementModalComponent } from './create-announcement-modal/create-announcement-modal.component';
import {FileUploadModule} from 'ng2-file-upload';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [AnnouncementComponent, CreateAnnouncementModalComponent],
  imports: [
    RouterModule.forChild(AnnouncementRoutes),
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FileUploadModule,
    NgbModule,
  ]
})
export class AnnouncementModule { }
