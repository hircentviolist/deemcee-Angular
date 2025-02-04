import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbNavModule, NgbDatepicker, NgbDatepickerModule, NgbTimepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { ClassesRoutes } from './classes.routing';
import { ClassesComponent } from './classes.component';
import { ClassComponent } from './class/class.component';
import { ClassFormComponent } from './class-form/class-form.component';
import { ClassLessonModalComponent } from './class-lesson-modal/class-lesson-modal.component';
import { ClassWeekViewComponent } from './class-week-view/class-week-view.component';
import { ClassLessonComponent } from './class-lesson/class-lesson.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin
]);

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClassesRoutes),
        FormsModule,
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgbNavModule,
        HttpClientModule,
        NgbDatepickerModule,
        NgbTimepickerModule,
        NgMultiSelectDropDownModule,
        NgbModalModule,
        FullCalendarModule
    ],
    declarations: [
        ClassesComponent,
        ClassComponent,
        ClassFormComponent,
        ClassLessonModalComponent,
        ClassWeekViewComponent,
        ClassLessonComponent
    ]
})

export class ClassesModule {}
