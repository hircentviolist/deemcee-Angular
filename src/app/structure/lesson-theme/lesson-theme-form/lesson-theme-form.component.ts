import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StructureService } from 'app/structure/structure.service';
import { LessonThemeDto } from 'app/lesson-theme-dto';
import { Category } from 'app/model/category';
import { Observable } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { map } from 'rxjs/operators';
import { CategoryGet } from 'app/model/category-get.dto';

@Component({
  selector: 'app-lesson-theme-form',
  templateUrl: './lesson-theme-form.component.html',
  styleUrls: ['./lesson-theme-form.component.css']
})
export class LessonThemeFormComponent implements OnInit {

  lessonForm: FormGroup;
  id: string;
  categorySelect$: Observable<CategoryGet[]>;
  versionSelect$: Observable<DataForSelect[]>
  submitted = false;
  queryParams: any;

  constructor(
    private structureService: StructureService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    })
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.categorySelect$ = this.structureService.getAllCategories();
    this.initializeForm();
    if (this.id !== 'new') {
      this.populateForm();
    }
    this.populateVersion();
  }

  initializeForm() {
    this.lessonForm = new FormGroup({
      category_id: new FormControl('', Validators.required),
      version_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lessons: new FormArray([
        new FormGroup({
          name: new FormControl('', Validators.required),
          order: new FormControl('1')
        }),
        new FormGroup({
          name: new FormControl('', Validators.required),
          order: new FormControl('2')
        }),
        new FormGroup({
          name: new FormControl('', Validators.required),
          order: new FormControl('3')
        }),
        new FormGroup({
          name: new FormControl('', Validators.required),
          order: new FormControl('4')
        })
      ]),
    });

    // Get Version Id from query params
    const version_id = this.route.snapshot.queryParamMap.get('version');
    const category_id = this.route.snapshot.queryParamMap.get('category');
    if (version_id && category_id) {
      this.lessonForm.get('version_id').setValue(version_id);
      this.lessonForm.get('category_id').setValue(category_id);
    } else {
      alert('Please Select Category and Version to add')
      this.router.navigate(['../..'], {queryParams: this.queryParams, relativeTo: this.route})
    }
  }

  populateForm() {

    this.structureService.getOneLessonTheme(+this.id)
    .subscribe(
      (data: LessonThemeDto) => {
        this.lessonForm.patchValue({
          name: data.name,
          category_id: data.category ? data.category.id : '',
          lessons: [
            {name: data.lessons[0].name, order: data.lessons[0].order},
            {name: data.lessons[1].name, order: data.lessons[1].order},
            {name: data.lessons[2].name, order: data.lessons[2].order},
            {name: data.lessons[3].name, order: data.lessons[3].order}
        ]});
      }
    )
  }

  onSelectCategory(e) {
    console.log(e);
    if (!e.target.value) {
      return;
    }

    this.router.navigate([], {queryParams: {category: this.lessonForm.get('category_id').value}, queryParamsHandling: 'merge'});

    this.populateVersion()
  }

  onSelectVersion(e) {
    if (!e.target.value) {
      return;
    }

    this.router.navigate([], {queryParams: {version: this.lessonForm.get('version_id').value}, queryParamsHandling: 'merge'});
  }

  populateVersion() {
    this.versionSelect$ =
    this.categorySelect$
    .pipe(
      map(categories => categories
          .filter(category => category.id === +this.lessonForm.get('category_id').value)
          .map(category => category.versions)
          .map(versions => versions.map(v => {
            return {
              id: v.id,
              name: v.name
            }
          }))[0]
      )
    )

  }


  isUpdate(): boolean {
    return this.id !== 'new';
  }

  onSubmit() {

    this.submitted = true;
    if (!this.lessonForm.valid) {
      return;
    }

    // TODO: Find better way than hardcoding this.
    this.lessonForm.value.lessons[0].order = 1;
    this.lessonForm.value.lessons[1].order = 2;
    this.lessonForm.value.lessons[2].order = 3;
    this.lessonForm.value.lessons[3].order = 4;

    if (this.isUpdate()) {
      this.structureService.updateLessonTheme(+this.id, this.lessonForm.value)
      .subscribe(
        () => {
          alert('Updated Lesson Theme')
          this.router.navigate(
            ['../../'],
            { relativeTo: this.route,
              queryParams: {
                active: 3, 
                category: this.lessonForm.get('category_id').value,
                version: this.lessonForm.get('version_id').value
              },
              queryParamsHandling: 'merge'});
        },
        err => {
          console.error(err);
          alert(`Unable to update Lesson Theme. ${JSON.stringify(err.error)}`)
        }
      )


    } else {
      // add new lesson
      console.log(JSON.stringify(this.lessonForm.value))
      this.structureService.addLessonTheme(this.lessonForm.value)
      .subscribe(
        () => {
          alert('Added Lesson Theme')
          this.router.navigate(
            ['../../'],
            {
              relativeTo: this.route,
              queryParams: {
                active: 3, 
                category: this.lessonForm.get('category_id').value,
                version: this.lessonForm.get('version_id').value
              },
            }
          );
        },
        err => {
          console.error(err);
          alert(`Unable to update Lesson Theme. ${JSON.stringify(err.error)}`)
        }
      )
    }


  }

}
