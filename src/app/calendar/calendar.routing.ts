import { Routes } from '@angular/router';

import { CalendarComponent } from './calendar.component';
import { EventFormComponent } from './event/event-form/event-form.component';
import { HolidayFormComponent } from './holiday/holiday-form/holiday-form.component';

export const CalendarRoutes: Routes = [{
    path: '',
    children: [
    {
        path: 'holiday/:id',
        component: HolidayFormComponent,
    },
    {
        path: 'event/:id',
        component: EventFormComponent,
    }, {
        path: '',
        pathMatch: 'full',
        component: CalendarComponent
    }]
}];
