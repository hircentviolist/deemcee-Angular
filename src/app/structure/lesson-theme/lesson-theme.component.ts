import { Component, OnInit } from '@angular/core';
import { LessonTheme } from 'app/model/lesson-theme';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { StructureService } from '../structure.service';
import { shareReplay, map, distinctUntilChanged } from 'rxjs/operators';
import { LessonThemeListItemDto } from 'app/model/lesson-theme-list-item-dto';
import { LessonThemeDto } from 'app/model/lesson-theme-dto';
import { Observable, empty } from 'rxjs';
import { Category } from 'app/model/category';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryGet } from 'app/model/category-get.dto';

@Component({
  selector: 'app-lesson-theme',
  templateUrl: './lesson-theme.component.html',
  styleUrls: ['./lesson-theme.component.css']
})
export class LessonThemeComponent implements OnInit {

  lesson$: Observable<LessonThemeListItemDto[]>;
  filteredLesson$: Observable<LessonThemeListItemDto[]>;

  lessonForm: FormGroup;

  submitted = false;

  version$: Observable<{id: number, name: string}[]>;

  categorySelect$: Observable<CategoryGet[]>;

  categories: CategoryGet[] = [];
  versions: {id: number, name: string}[] = [];
  lessons: LessonThemeListItemDto[];

  selectedGrade: string = '0';
  selectedVersion: string = '0';
  queryParams: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private structureService: StructureService
  ) {
    this.route.queryParams.subscribe(params => {
      this.queryParams = {...params};
    })
  }

  ngOnInit(): void {
    this.populateList();
    
    this.structureService.getAllCategories().subscribe((data: any) => {
      this.categories = data;
      
      if (this.queryParams.category && this.queryParams.category !== '0') {
        this.onSelectCategory({target: {value: this.queryParams.category}})
      }
    });
  }


  populateList() {
    console.log('this.queryParams',this.queryParams)
    this.structureService.getAllLessonTheme(
      this.queryParams.category && this.queryParams.category !== '0' ? this.queryParams.category : 0,
      this.queryParams.version && this.queryParams.version !== '0' ? this.queryParams.version : 0,
    ).subscribe((data: any) => {
      if (this.selectedGrade === '0' || this.selectedVersion === '0') {
        this.lessons = null;
      } else {
        this.lessons = data;
      }
    })
  }


  onDelete(id: number) {
    this.structureService.deleteLessonTheme(id)
    .subscribe(
      () => this.populateList(),
      err => {
        console.error(err);
        alert(`Unable to delete Lesson Theme. ${JSON.stringify(err.error)}`)
      }
    )
  }

  onSelectCategory(e) {
    if (!e.target.value || e.target.value === '0') {
      return;
    }
    this.lessons = null;

    this.selectedGrade = e.target.value;

    this.versions = this.categories.find(category => {
      return +category.id === +e.target.value
    }).versions.map(version => {
      return {
        id: version.id,
        name: version.name
      }
    })

    const latestVersion = this.versions[this.versions.length - 1];
    const versionExist = this.versions.some(version => {
      return +version.id === +this.queryParams.version
    })

    if (!versionExist) {
      this.selectedVersion = latestVersion.id.toString();

      this.router.navigate([], {
        queryParams: {
          category: +this.selectedGrade,
          version: latestVersion.id.toString()
        }, 
        queryParamsHandling: 'merge'
      })
    } else {
      this.selectedVersion = this.queryParams.version;
    }

    setTimeout(() => this.populateList())
  }

  populateVersion() {
    this.version$ =
    this.categorySelect$
    .pipe(
      map(categories => categories
          .filter(category => category.id === +this.selectedGrade)
          .map(category => category.versions)
          .map(versions => versions.map(v => {
            return {
              id: v.id,
              name: v.name
            }
          }))[0]
      )
    )
    
    this.router.navigate([], {
      queryParams: {
        category: +this.selectedGrade
      }, 
      queryParamsHandling: 'merge'
    })

    if (this.queryParams.version  && this.queryParams.version !== '0') {
      this.onSelectVersion({target: {value: this.queryParams.version}})
      this.queryParams.version = null;
    }
  }

  onSelectVersion(e) {
    if (!e.target.value || e.target.value === '0') {
      return;
    }
    this.lessons = null;

    this.selectedVersion = e.target.value;
    this.router.navigate([], {queryParams: {version: +e.target.value}, queryParamsHandling: 'merge'})

    setTimeout(() => this.populateList())
  }

  generateVersions() {
    // this.versions = Array.from(new Set(...this.lessons.map(l => l.version.name)));
  }
}
