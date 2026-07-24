import { Component, Input, OnInit, inject } from '@angular/core';

import { FsPopoverModule } from '@firestitch/popover';

import { FsAppAclService } from './../../services/app-acl.service';

@Component({
  selector: 'fs-acl-role-popover',
  templateUrl: './acl-role-popover.component.html',
  styleUrls: ['./acl-role-popover.component.scss'],
  standalone: true,
  imports: [FsPopoverModule],
})
export class FsAclRolePopoverComponent implements OnInit {

  @Input() aclRole;
  @Input() objectName;

  public permissions = [];

  private readonly _appAclService = inject(FsAppAclService);

  public ngOnInit() {
    const aclRolePermissions = this.aclRole.permissions || [];

    this._appAclService.getPermissions()
      .subscribe((response) => {
        this.permissions = response.filter((item) => {
          return aclRolePermissions.some((permission) => {
            return item.value === permission.value;
          });
        });
      });
  }
}
