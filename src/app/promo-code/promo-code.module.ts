import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PromoCodeComponent } from "./promo-code.component";
import { PromoCodeRoutes } from "./promo-code.routing.module";
import { AddComponent } from './add/add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule({
    declarations: [
        PromoCodeComponent,
        AddComponent,
    ],
    imports: [
        RouterModule.forChild(PromoCodeRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        NgbModule,
        NgMultiSelectDropDownModule,
    ],
    entryComponents: [
        //
    ]
})

export class PromoCodeModule { }