import { Injectable, inject } from '@angular/core';

import { list } from '@firestitch/common';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { FS_APP_ACL_CONFIG } from './../injectors/app-acl-config.injector';
import { AclLevel } from './../interfaces/acl-level';
import { AclPermission } from './../interfaces/acl-permission';
import { AppAclConfig } from './../interfaces/app-acl-config';


@Injectable({
  providedIn: 'root',
})
export class FsAppAclService {
  private _appAclConfig = inject<AppAclConfig>(FS_APP_ACL_CONFIG);

  private _permissions$: Observable<AclPermission[]>;
  private _levels$: Observable<AclLevel[]>;

  public getPermissions(): Observable<AclPermission[]> {
    if (!this._permissions$) {
      this._permissions$ = this._appAclConfig.permissions.pipe(
        shareReplay(1),
      );
    }

    return this._permissions$;
  }

  public getLevels(): Observable<AclLevel[]> {
    if (!this._levels$) {
      this._levels$ = this._appAclConfig.levels.pipe(
        shareReplay(1),
      );
    }

    return this._levels$;
  }


  public getIndexedLevels() {
    return this.getLevels()
      .pipe(
        map((data) => {
          return list(data, 'name', 'value');
        }),
      );
  }
}
