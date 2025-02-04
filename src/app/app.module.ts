import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule, NgbNavModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { HttpsInterceptor } from './https.interceptor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports:      [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(AppRoutes, {
          useHash: true
        }),
        NgbModule,
        NgbModalModule,
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        FixedPluginModule,
        FlexLayoutModule,
        NgbNavModule,
        SharedModule,
        HttpClientModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
    ],
    providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpsInterceptor,
          multi: true
        }
    ],
    bootstrap:    [ AppComponent ]
})

export class AppModule { }
