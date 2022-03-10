import { Injectable, Inject } from '@angular/core';

import { list } from '@firestitch/common';

import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

import { isArray } from 'lodash-es';


import { FS_APP_ACL_CONFIG } from './../injectors/app-acl-config.injector';
import { AppAclConfig } from './../interfaces/app-acl-config';
import { AclPermission } from './../interfaces/acl-permission';
import { AclLevel } from './../interfaces/acl-level';

import * as _snakecaseKeys from 'snakecase-keys';
import * as _camelcaseKeys from 'camelcase-keys';

const snakecaseKeys = _snakecaseKeys;
const camelcaseKeys = _camelcaseKeys;


@Injectable({
  providedIn: 'root',
})
export class FsAppAclService {

  private _permissions$: ReplaySubject<AclPermission[]>;
  private _levels$: ReplaySubject<AclLevel[]>;

  constructor(
    @Inject(FS_APP_ACL_CONFIG) private _appAclConfig: AppAclConfig,
  ) { }

  public getPermissions() {

    if (!this._permissions$) {
      this._permissions$ = new ReplaySubject();

      this._appAclConfig.permissions
        .pipe(
          map((data) => this.input(data)),
        )
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
        .pipe(
          map((data) => this.input(data)),
        )
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

  public input(data) {
    if (isArray(data)) {
      return data.map(item => {
        return this._appAclConfig.case === 'snake' ? camelcaseKeys(item, { deep: true }) : item;
      });
    } else {
      return this._appAclConfig.case === 'snake' ? camelcaseKeys(data, { deep: true }) : data;
    }
  }

  public output(data) {
    if (isArray(data)) {
      return data.map(item => {
        return this._appAclConfig.case === 'snake' ? snakecaseKeys(item, { deep: true }) : item;
      });
    } else {
      return this._appAclConfig.case === 'snake' ? snakecaseKeys(data, { deep: true }) : data;
    }
  }
}
