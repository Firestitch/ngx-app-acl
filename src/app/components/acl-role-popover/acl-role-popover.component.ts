import { Component, OnInit, Input } from '@angular/core';
import { FsAppAclService } from './../../services/app-acl.service';

@Component({
  selector: 'fs-acl-role-popover',
  templateUrl: './acl-role-popover.component.html',
  styleUrls: ['./acl-role-popover.component.scss']
})
export class FsAclRolePopoverComponent implements OnInit {

  @Input() aclRole;
  @Input() objectName;

  public permissions = [];

  public constructor(
    private readonly _appAclService: FsAppAclService,
  ) {}

  public ngOnInit() {
    const aclRolePermissions = this.aclRole.permissions || [];

    this._appAclService.getPermissions()
      .subscribe((response) => {
        this.permissions = response.filter(item => {
          return aclRolePermissions.some(permission => {
            return item.value === permission.value;
          });
      });
    });
  }
}
