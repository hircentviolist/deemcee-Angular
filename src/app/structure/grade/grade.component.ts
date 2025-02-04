import { Component, OnInit } from '@angular/core';
import { Grade } from 'app/model/grade';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StructureService } from '../structure.service';
import { DataForSelect } from 'app/model/data-for-select';
import { shareReplay, filter, map, tap } from 'rxjs/operators';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {

  state: {
    main: 'show' | 'add';
    rows: {state: 'show' | 'update'}[]
  }

  grades: Grade[];

  gradeForm: FormGroup;

  submitted = false;

  categorySelect;

  constructor(private structureService: StructureService) { }

  ngOnInit(): void {
    this.populateList();
    this.initializeForm();
    this.categorySelect = this.structureService.getAllCategories()
    .pipe(
      // tap(console.log),
      shareReplay()
    );
  }

  getCategory(id: number) {
    console.log(id);
    return this.categorySelect
            .pipe(
              map((cat: {id: number; name: string}[]) => cat.filter(c => c.id === id)[0]['name']),

            );
  }

  initializeState() {
    this.state = {
      main: 'show',
      rows: []
    }

    this.grades.forEach(el => {
      this.state.rows.push({state: 'show'})
    })
  }

  initializeForm() {
    this.gradeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
    })
  }

  populateList() {
    this.structureService.getAllGrades()
    .subscribe(
      data => {
        console.log(data);
        this.grades = data;
        this.initializeState();
      },
      error => {
        console.error(error);
        alert(`Unable to fetch grades. ${JSON.stringify(error.error)}`)
      }
    )
  }

  populateForm(i: number) {

    const grade = this.grades[i];

    this.gradeForm.setValue({name: grade.name, category_id: grade?.category_id, price: grade.price})
  }

  onSubmit() {
    this.submitted = true;
    if (!this.gradeForm.valid) {
      return;
    }

    if (this.isUpdate()) {
      // update

      // get category id to update
      const categoryIndex = this.state.rows.map(r => r.state).indexOf('update');
      const id = this.grades[categoryIndex].id;
      console.log(id);
      this.structureService.updateGrade(id, this.gradeForm.value)
      .subscribe(
        () => {
          this.populateList()
          this.gradeForm.reset()
        },
        err => {
          console.error(err);
          alert(`Unable to update Grade. ${JSON.stringify(err.error)}`)
        }
      )


    } else {
      // add new category
      this.structureService.addGrade(this.gradeForm.value)
      .subscribe(
        () => {
          this.populateList()
          this.gradeForm.reset()
        },
        err => {
          console.error(err);
          alert(`Unable to update Grade. ${JSON.stringify(err.error)}`)
        }
      )
    }


  }

  onDelete(id: number) {
    this.structureService.deleteGrade(id)
    .subscribe(
      () => this.populateList(),
      err => {
        console.error(err);
        alert(`Unable to delete grade. ${JSON.stringify(err.error)}`)
      }
    )
  }
  //
  // onChangeMain(state: 'add' | 'show') {
  //   // reset all rows to show
  //   this.state.rows.map(r => r.state = 'show');
  //   this.state.main = state;
  //   this.gradeForm.reset();
  // }

  onChangeRows(i: number, state: 'show' | 'update') {
    console.log(i, state);
    this.state.main = 'show';
    // reset all rows to show
    this.state.rows.map(r => r.state = 'show');
    // set row to state
    this.state.rows[i].state = state;
    if (state === 'update') {
      this.gradeForm.reset();
      this.populateForm(i);
      this.submitted = false;
    }
  }

  isUpdate(): boolean {
    if (!this.state) {
      return false;
    }
    return this.state.rows.filter(s => s.state === 'update').length > 0;
  }

}
