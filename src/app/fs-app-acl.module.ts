import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsListModule } from '@firestitch/list';
import { FsPopoverModule } from '@firestitch/popover';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { FsBadgeModule } from '@firestitch/badge';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';

import { FsAclRolesComponent } from './components/acl-roles/acl-roles.component';
import { FsAclPermissionPopoverComponent } from './components/acl-permission-popover/acl-permission-popover.component';
import { FsAclRolePopoverComponent } from './components/acl-role-popover/acl-role-popover.component';
import { FsAclEntriesComponent } from './components/acl-entries/acl-entries.component';
import { FsAclRoleComponent } from './components/acl-role/acl-role.component';
import { FsAclObjectRolesComponent } from './components/acl-object-roles/acl-object-roles.component';
import { FsAclEntryComponent } from './components/acl-entry/acl-entry.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BulkOptionsFilterPipe } from './pipes/bulk-options-filter.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule,

    FsListModule,
    FsPopoverModule,
    FsDialogModule,
    FsFormModule,
    FsLabelModule,
    FsRadioGroupModule,
    FsBadgeModule,
    FsCheckboxGroupModule,
  ],
  declarations: [
    FsAclRolesComponent,
    FsAclPermissionPopoverComponent,
    FsAclRoleComponent,
    FsAclEntriesComponent,
    FsAclRolePopoverComponent,
    FsAclObjectRolesComponent,
    FsAclEntryComponent,
    BulkOptionsFilterPipe,
  ],
  exports: [
    FsAclRolesComponent,
    FsAclPermissionPopoverComponent,
    FsAclRoleComponent,
    FsAclEntriesComponent,
    FsAclRolePopoverComponent,
    FsAclObjectRolesComponent,
    FsAclEntryComponent,
  ],
})
export class FsAppAclModule {}
