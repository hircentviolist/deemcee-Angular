import { Component, OnInit } from '@angular/core';
import { StructureService } from '../structure.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-category-modal',
  templateUrl: './new-category-modal.component.html',
  styleUrls: ['./new-category-modal.component.css']
})
export class NewCategoryModalComponent implements OnInit {

  createForm: FormGroup;
  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private structureService: StructureService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.createForm = new FormGroup({
      name: new FormControl('', Validators.required)
    })
  }

  onSubmit() {
    console.log(this.createForm)
    if (!this.createForm.valid) {
      this.submitted = true;
      return;
    }
    this.structureService.addCategory(this.createForm.value)
    .subscribe(resp => {
      alert('New Category Created');
      this.activeModal.close(true);
    }, err => {
      alert(`Unable to Create Category. ${JSON.stringify(err)}`);
    })
  }

  onClose(e: Event) {
    e.preventDefault();
    e.stopPropagation()
    this.createForm.disable();
    this.activeModal.dismiss();
  }

}
