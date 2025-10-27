import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_APP_ACL_CONFIG } from '../src/app/injectors/app-acl-config.injector';
import { of } from 'rxjs';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsExampleModule } from '@firestitch/example';
import { FsListModule } from '@firestitch/list';
import { FsScrollModule } from '@firestitch/scroll';
import { FsMessageModule } from '@firestitch/message';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsLabelModule, FsExampleModule.forRoot(), FsListModule.forRoot(), FsScrollModule.forRoot(), FsMessageModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true })),
        {
            provide: FS_APP_ACL_CONFIG,
            useValue: {
                case: 'camel',
                permissions: of([
                    { "value": "system", "name": "System", "levels": ["app"], "accesses": [15], "description": "Access the \"System\" section:  Includes backend settings, crons, api logs, etc.", "requires": ["admin"] },
                    { "value": "admin", "name": "Admin", "levels": ["app"], "accesses": [15], "description": "Access the \"Admin\" section: Includes products, companies, areas, messages, etc. Can perform any internal approval.", "requires": [] },
                    { "value": "workspaceadmin", "name": "Workspace Admin", "levels": ["workspace"], "accesses": [15], "description": "" },
                ]),
                levels: of([
                    { "value": "app", "name": "App" },
                    { "value": "workspace", "name": "Workspace" },
                ])
            },
            deps: [],
        },
        provideAnimations(),
        provideRouter(routes)
    ]
})
  .catch(err => console.error(err));

