import { Routes } from '@angular/router';
import { ClassFormComponent } from './class-form/class-form.component';
import { ClassLessonComponent } from './class-lesson/class-lesson.component';
import { ClassWeekViewComponent } from './class-week-view/class-week-view.component';
import { ClassesComponent } from './classes.component';

export const ClassesRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: ClassesComponent
        },
        {
            path: 'week-view',
            component: ClassWeekViewComponent
        },
        {
            path: ':id',
            component: ClassFormComponent,
        },
        {
            path: ':id/lesson/:id',
            component: ClassLessonComponent,
        },
    ]
}];
