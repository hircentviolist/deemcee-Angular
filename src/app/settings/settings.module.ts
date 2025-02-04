import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule
    ]
})

export class SettingsModule { }
