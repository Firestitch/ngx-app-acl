import { Component, Input, OnInit, inject } from '@angular/core';

import { FsPopoverModule } from '@firestitch/popover';

import { FsAppAclService } from './../../services/app-acl.service';

@Component({
  selector: 'acl-permission-popover',
  templateUrl: './acl-permission-popover.component.html',
  styleUrls: ['./acl-permission-popover.component.scss'],
  standalone: true,
  imports: [FsPopoverModule],
})
export class FsAclPermissionPopoverComponent implements OnInit {

  @Input() permission;

  public description;

  private _appAclService = inject(FsAppAclService);

  public ngOnInit() {
    this._appAclService.getPermissions()
      .subscribe((permissions) => {
        this.description = permissions.filter((item) => {
          return item.value === this.permission.value;
        }).map((item) => {
          return item.description;
        })[0];
      });
  }
}
