import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StructureComponent } from './structure.component';
import { LessonThemeFormComponent } from './lesson-theme/lesson-theme-form/lesson-theme-form.component';


const routes: Routes = [
  {path: 'theme/:id', component: LessonThemeFormComponent},
  {path: '', pathMatch: 'full', component: StructureComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureRoutingModule { }
