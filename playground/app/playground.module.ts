import { FsListModule } from '@firestitch/list';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsAppAclModule } from '@firestitch/package';
import { FsLabelModule } from '@firestitch/label';
import { FsSelectionModule } from '@firestitch/selection';
import { FsPopoverModule } from '@firestitch/popover';
import { FsScrollModule } from '@firestitch/scroll';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  KitchenSinkComponent,
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { of } from 'rxjs';

import { FS_APP_ACL_CONFIG } from './../../src/app/injectors/app-acl-config.injector';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsAppAclModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsPopoverModule.forRoot(),
    FsExampleModule.forRoot(),
    FsListModule.forRoot(),
    FsScrollModule.forRoot(),
    FsSelectionModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    KitchenSinkConfigureComponent
  ],
  providers: [
    {
      provide: FS_APP_ACL_CONFIG,
      useValue: {
        permissions: of([{ "value": "system", "name": "System", "levels": ["app"], "accesses": [15], "description": "Access the \"System\" section:  Includes backend settings, crons, api logs, etc." }, { "value": "admin", "name": "Admin", "levels": ["app"], "accesses": [15], "description": "Access the \"Admin\" section: Includes products, companies, areas, messages, etc. Can perform any internal approval." }, { "value": "item_override", "name": "Item Override", "levels": ["app", "company"], "accesses": [15], "description": "Override the product's pricing in a contract or work order item." }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "levels": ["app", "company"], "accesses": [15], "description": "Allow selection of 10 pay periods previous to the earliest pay period that could otherwise be selected" }, { "value": "vp_approval", "name": "VP Approval", "levels": ["company"], "accesses": [0, 15], "description": "Perform \"Approval\" actions at VP, Director or Ops level." }, { "value": "sage", "name": "Sage", "levels": ["company"], "accesses": [0, 15], "description": "Access to the Sage APIs for external Sage integration." }, { "value": "director_approval", "name": "Director Approval", "levels": ["area"], "accesses": [0, 15], "description": "Perform \"Approval\" actions at Director or Ops level." }, { "value": "ops_approval", "name": "Ops Approval", "levels": ["area"], "accesses": [0, 15], "description": "Perform \"Approval\" actions at Ops level." }, { "value": "include_order_notify", "name": "Include In Work Order Notifications", "accesses": [0, 5], "levels": ["client_account"], "description": "Automatically include as a \"Notification Staff Member\" for new contracts \u0026 work orders." }]),
        levels: of([{ "value": "app", "name": "App" }, { "value": "company", "name": "Company" }, { "value": "area", "name": "Area" }, { "value": "clientAccount", "name": "Client Account" }, { "value": "contact", "name": "Contact" }])
      },
      deps: [],
    }
  ]
})
export class PlaygroundModule {}
