import { NgModule } from '@angular/core';

import { FsAclEntriesComponent } from './components/acl-entries/acl-entries.component';
import { FsAclEntryComponent } from './components/acl-entry/acl-entry.component';
import { FsAclObjectRolesComponent } from './components/acl-object-roles/acl-object-roles.component';
import { FsAclPermissionPopoverComponent } from './components/acl-permission-popover/acl-permission-popover.component';
import { FsAclRolePopoverComponent } from './components/acl-role-popover/acl-role-popover.component';
import { FsAclRoleComponent } from './components/acl-role/acl-role.component';
import { FsAclRolesComponent } from './components/acl-roles/acl-roles.component';

@NgModule({
  imports: [
    FsAclEntriesComponent,
    FsAclEntryComponent,
    FsAclObjectRolesComponent,
    FsAclPermissionPopoverComponent,
    FsAclRoleComponent,
    FsAclRolePopoverComponent,
    FsAclRolesComponent,
  ],
  exports: [
    FsAclEntriesComponent,
    FsAclEntryComponent,
    FsAclObjectRolesComponent,
    FsAclPermissionPopoverComponent,
    FsAclRoleComponent,
    FsAclRolePopoverComponent,
    FsAclRolesComponent,
  ],
})
export class FsAppAclModule {}
