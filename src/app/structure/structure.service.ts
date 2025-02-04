import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Category } from 'app/model/category';
import { GradeDto } from 'app/model/grade-dto';
import { Grade } from 'app/model/grade';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LessonTheme } from 'app/model/lesson-theme';
import { LessonThemeListItemDto } from 'app/model/lesson-theme-list-item-dto';
import { LessonThemeDto } from 'app/lesson-theme-dto';
import { CategoryGet } from 'app/model/category-get.dto';
import { CategoryDetail } from 'app/model/category-detail.dto';
import { VersionPost } from 'app/model/version-post.dto';
import { identifierModuleUrl } from '@angular/compiler';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(private http: HttpClient) { }

  getAllGrades(): Observable<Grade[]> {
    const url = environment.backendApi + 'program/grades';
    return this.http.get<GradeDto[]>(url)
            .pipe(
              map(grade => {
                return grade.map(g => {
                  const gr: any = g;
                  if (g.category) {
                    gr.category_id = g.category.id;
                    delete gr.category;
                  }
                  return gr;
                })
              })
            )
  }

  getOneGrade(id: number) {
    const url = environment.backendApi + 'program/grades/' + id.toString();
    return this.http.get<GradeDto>(url)
  }

  addGrade(grade: Grade) {
    const url = environment.backendApi + 'program/grades';
    return this.http.post(url, grade);
  }

  updateGrade(id: number, grade: Grade) {
    const url = environment.backendApi + 'program/grades/' + id.toString();
    return this.http.put(url, grade);
  }

  deleteGrade(id: number) {
    // May not be supported in backend
    const url = environment.backendApi + 'program/grades/' + id.toString();
    return this.http.delete(url);
  }

  listGrade() {
    // return this.getAllCategories();
  }

  getAllCategories() {
    const url = environment.backendApi + 'program/categories';
    return this.http.get<CategoryGet[]>(url)
  }

  getOneCategory(id: number) {
    const url = environment.backendApi + 'program/categories/' + id.toString();
    return this.http.get<CategoryDetail>(url)
  }

  addCategory(category: Category) {
    const url = environment.backendApi + 'program/categories';
    return this.http.post(url, category);
  }

  updateCategory(id: number, category) {
    const url = environment.backendApi + 'program/categories/' + id.toString();
    return this.http.put(url, category);
  }

  deleteCategory(id: number) {
    // May not be supported in backend
    const url = environment.backendApi + 'program/categories/' + id.toString();
    return this.http.delete(url);
  }

  listCategory() {
    return this.getAllCategories();
  }

  getAllLessonTheme(category_id: number = null, version_id: number = null, start_date: string = null): Observable<LessonThemeListItemDto[]> {
    const url = environment.backendApi + 'program/themes';
    let params = new HttpParams();

    if (category_id) {
      params = params.append('category_id', String(category_id));
    }

    if (version_id) {
      params = params.append('version_id', String(version_id));
    }

    if (start_date) {
      const startDate = moment(start_date);
      params = params.append('start_date', startDate.format('YYYY-MM-DD'));
    }
    
    return this.http.get<LessonThemeListItemDto[]>(url, {params})
            // .pipe(
            //   map(grade => {
            //     return grade.map(g => {
            //       const gr: any = g;
            //       if (g.category) {
            //         gr.category_id = g.category.id;
            //         delete gr.category;
            //       }
            //       return gr;
            //     })
            //   })
            // )
  }

  getOneLessonTheme(id: number) {
    const url = environment.backendApi + 'program/themes/' + id.toString();
    return this.http.get<LessonThemeDto>(url)
  }

  addLessonTheme(lesson: LessonTheme) {
    const url = environment.backendApi + 'program/themes';
    return this.http.post(url, lesson);
  }

  updateLessonTheme(id: number, lesson: LessonTheme) {
    const url = environment.backendApi + 'program/themes/' + id.toString();
    return this.http.put(url, lesson);
  }

  deleteLessonTheme(id: number) {
    // May not be supported in backend
    const url = environment.backendApi + 'program/themes/' + id.toString();
    return this.http.delete(url);
  }

  listLessonTheme() {
    // return this.getAllCategories();
  }

  addCategoryVersion(newVersion: VersionPost) {
    const url = environment.backendApi + 'program/versions';
    return this.http.post(url, newVersion);
  }

  extendCategoryVersion(id: number, endDate: {end_date: string}) {
    const url = environment.backendApi + 'program/versions/' + id.toString()
    return this.http.put(url, endDate)
  }


}
