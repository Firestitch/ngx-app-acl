import { Component, OnInit, Input, Inject } from '@angular/core';
import { FsAppAclService } from './../../services/app-acl.service';

@Component({
  selector: 'acl-permission-popover',
  templateUrl: './acl-permission-popover.component.html',
  styleUrls: ['./acl-permission-popover.component.scss']
})
export class FsAclPermissionPopoverComponent implements OnInit {

  @Input() permission;

  public description;

  public constructor(
    private _appAclService: FsAppAclService
  ) { }

  public ngOnInit() {
    this._appAclService.getPermissions()
    .subscribe(permissions => {
      this.description = permissions.filter(item => {
        return item.value === this.permission.value;
      }).map(item => {
        return item.description;
      })[0];
    });
  }
}
