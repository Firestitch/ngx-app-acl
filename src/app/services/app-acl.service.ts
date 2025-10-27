import { Injectable, inject } from '@angular/core';

import { list } from '@firestitch/common';

import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';


import { FS_APP_ACL_CONFIG } from './../injectors/app-acl-config.injector';
import { AppAclConfig } from './../interfaces/app-acl-config';
import { AclPermission } from './../interfaces/acl-permission';
import { AclLevel } from './../interfaces/acl-level';


@Injectable({
  providedIn: 'root',
})
export class FsAppAclService {
  private _appAclConfig = inject<AppAclConfig>(FS_APP_ACL_CONFIG);


  private _permissions$: ReplaySubject<AclPermission[]>;
  private _levels$: ReplaySubject<AclLevel[]>;

  public getPermissions() {

    if (!this._permissions$) {
      this._permissions$ = new ReplaySubject();

      this._appAclConfig.permissions
        .subscribe((permissions) => {
          this._permissions$.next(permissions);
          this._permissions$.complete();
        });
    }

    return this._permissions$;
  }

  public getLevels() {

    if (!this._levels$) {
      this._levels$ = new ReplaySubject();

      this._appAclConfig.levels
        .subscribe((levels) => {
          this._levels$.next(levels);
          this._levels$.complete();
        });
    }

    return this._levels$;
  }


  public getIndexedLevels() {
    return this.getLevels()
      .pipe(
        map((data) => {
          return list(data, 'name', 'value');
        })
      );
  }
}
