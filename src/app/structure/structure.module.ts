import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureRoutingModule } from './structure-routing.module';
import { CategoryComponent } from './category/category.component';
import { GradeComponent } from './grade/grade.component';
import { LessonThemeComponent } from './lesson-theme/lesson-theme.component';
import { StructureComponent } from './structure.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { LessonThemeFormComponent } from './lesson-theme/lesson-theme-form/lesson-theme-form.component';
import { ViewCategoryModalComponent } from './view-category-modal/view-category-modal.component';
import { UpgradeCategoryModalComponent } from './upgrade-category-modal/upgrade-category-modal.component';
import { ExtendCategoryModalComponent } from './extend-category-modal/extend-category-modal.component';
import { NewCategoryModalComponent } from './new-category-modal/new-category-modal.component';


@NgModule({
  declarations: [
    CategoryComponent,
    GradeComponent,
    LessonThemeComponent,
    StructureComponent,
    LessonThemeFormComponent,
    ViewCategoryModalComponent,
    UpgradeCategoryModalComponent,
    ExtendCategoryModalComponent,
    NewCategoryModalComponent],
  imports: [
    CommonModule,
    StructureRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbModalModule,
    HttpClientModule,
    FormsModule
  ],
  entryComponents: [
    ViewCategoryModalComponent,
    UpgradeCategoryModalComponent,
    ExtendCategoryModalComponent
  ]
})
export class StructureModule { }
