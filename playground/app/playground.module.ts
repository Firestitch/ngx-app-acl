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
        case: 'camel',
        permissions: of([
          { "value": "system", "name": "System", "levels": ["app"], "accesses": [15], "description": "Access the \"System\" section:  Includes backend settings, crons, api logs, etc." },
          { "value": "admin", "name": "Admin", "levels": ["app"], "accesses": [15], "description": "Access the \"Admin\" section: Includes products, companies, areas, messages, etc. Can perform any internal approval." },
          { "value": "workspaceadmin", "name": "Workspace Admin", "levels": ["workspace"], "accesses": [15], "description": "" },
        ]),
          levels: of([
          { "value": "app", "name": "App" },
          { "value": "workspace", "name": "Workspace" },
        ])
      },
      deps: [],
    }
  ]
})
export class PlaygroundModule {}
