import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { MenuComponent } from './menu/menu.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {NguCarouselModule} from '@ngu/carousel';



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    IvyCarouselModule,
    NguCarouselModule,
  ]
})
export class BranchModule { }
