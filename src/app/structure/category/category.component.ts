import { Component, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { StructureService } from '../structure.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CategoryGet } from 'app/model/category-get.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpgradeCategoryModalComponent } from '../upgrade-category-modal/upgrade-category-modal.component';
import { ExtendCategoryModalComponent } from '../extend-category-modal/extend-category-modal.component';
import { ViewCategoryModalComponent } from '../view-category-modal/view-category-modal.component';
import { NewCategoryModalComponent } from '../new-category-modal/new-category-modal.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  category$: Observable<CategoryGet[]>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private structureService: StructureService) {
      this.router.navigate([], {queryParams: {active: 1}})
    }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.category$ = this.structureService.getAllCategories();
  }

  onUpgradeCategory(id: number): void {
    const modalRef = this.modalService.open(UpgradeCategoryModalComponent, {size: 'lg'})
    modalRef.componentInstance.categoryDetail$ = this.structureService.getOneCategory(id);
  }

  onExtendCategory(id: number) {
    const modalRef = this.modalService.open(ExtendCategoryModalComponent)
    modalRef.componentInstance.categoryDetail$ = this.structureService.getOneCategory(id);
    modalRef.result.then(r => {
      if (r) {
        this.getAllCategories();
      }
    })
  }

  onViewCategory(id: number) {
    const modalRef = this.modalService.open(ViewCategoryModalComponent)
    modalRef.componentInstance.categoryDetail$ = this.structureService.getOneCategory(id);
  }
  //
  // onNewCategory() {
  //   const modalRef = this.modalService.open(NewCategoryModalComponent);
  //   modalRef.result.then(resp => {
  //     if (resp) {
  //       this.getAllCategories();
  //     }
  //   }).catch(err => console.error)
  // }


}
