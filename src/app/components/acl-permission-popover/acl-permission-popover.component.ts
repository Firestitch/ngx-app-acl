import { Component, OnInit, Input, inject } from '@angular/core';
import { FsAppAclService } from './../../services/app-acl.service';
import { FsPopoverModule } from '@firestitch/popover';

@Component({
    selector: 'acl-permission-popover',
    templateUrl: './acl-permission-popover.component.html',
    styleUrls: ['./acl-permission-popover.component.scss'],
    standalone: true,
    imports: [FsPopoverModule]
})
export class FsAclPermissionPopoverComponent implements OnInit {
  private _appAclService = inject(FsAppAclService);


  @Input() permission;

  public description;

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
