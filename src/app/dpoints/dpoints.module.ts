import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DPointsComponent } from './dpoints.component';
import { DPointRoutes } from './dpoints-routing.module';
import { RouterModule } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DPointsManagementComponent } from './dpoints-management/dpoints-management.component';
import { PointValueComponent } from './modal/point-value/point-value.component';
import { ShowComponent } from './dpoints-management/show/show.component';
import { CreateRedemptionComponent } from './modal/create-redemption/create-redemption.component';
import { CreateCampaignComponent } from './modal/create-campaign/create-campaign.component';
import { BranchTransactionComponent } from './branch-transaction/branch-transaction.component';
import { PurchaseDPointComponent } from './modal/purchase-d-point/purchase-d-point.component';
import { CreateTransactionComponent } from './modal/create-transaction/create-transaction.component';
import { ParentsTransactionComponent } from './parents-transaction/parents-transaction.component';
import { ShowParentComponent } from './parents-transaction/show-parent/show-parent.component';

@NgModule({
    declarations: [
        DPointsComponent,
        DPointsManagementComponent,
        PointValueComponent,
        ShowComponent,
        CreateRedemptionComponent,
        CreateCampaignComponent,
        BranchTransactionComponent,
        PurchaseDPointComponent,
        CreateTransactionComponent,
        ParentsTransactionComponent,
        ShowParentComponent
    ],
    imports: [
        RouterModule.forChild(DPointRoutes),
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        NgbNavModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbModule,
        NgbAccordionModule,
        NgMultiSelectDropDownModule,
    ],
    entryComponents: [
        //
    ]
})

export class DPointsModule { }