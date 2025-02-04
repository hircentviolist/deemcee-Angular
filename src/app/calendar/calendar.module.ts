import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './calendar.component';
import { CalendarRoutes } from './calendar.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbNavModule, NgbDatepicker, NgbDatepickerModule, NgbTimepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Calendar2Component } from './calendar/calendar.component';
import { HolidayComponent } from './holiday/holiday.component';
import { EventComponent } from './event/event.component';
// import { ClassComponent } from './class/class.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EventFormComponent } from './event/event-form/event-form.component';
import { InfoModalComponent } from './modal/info-modal/info-modal.component';
import { EventModalComponent } from './modal/event-modal/event-modal.component';
// import { ClassFormComponent } from './class/class-form/class-form.component';
import { HolidayFormComponent } from './holiday/holiday-form/holiday-form.component';
// import { ClassLessonComponent } from './class/class-lesson/class-lesson.component';
// import { ClassLessonModalComponent } from './class/class-lesson-modal/class-lesson-modal.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
// import { ClassWeekViewComponent } from './class/class-week-view/class-week-view.component'; // a plugin

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin
]);

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CalendarRoutes),
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
        CalendarComponent,
        Calendar2Component,
        HolidayComponent,
        EventComponent,
        // ClassComponent,
        EventFormComponent,
        InfoModalComponent,
        EventModalComponent,
        // ClassFormComponent,
        HolidayFormComponent,
        // ClassLessonComponent,
        // ClassLessonModalComponent,
        // ClassWeekViewComponent
    ],
    entryComponents: [
        InfoModalComponent,
        EventModalComponent,
    ]
})

export class CalendarModule {}
