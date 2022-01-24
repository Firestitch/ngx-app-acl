import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AclRoleAccesses } from './../../consts/acl-role-accesses';
import { AclRole } from './../../interfaces';
import { map, takeUntil, tap } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import { list } from '@firestitch/common';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { forkJoin, Observable, of, Subject } from 'rxjs';
import { FsAppAclService } from './../../services';


@Component({
  templateUrl: './acl-role.component.html',
  styleUrls: ['./acl-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAclRoleComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent) public list: FsListComponent;

  public aclRole: AclRole = null;
  public environment;
  public permissions: any[] = [];
  public listConfig: FsListConfig;
  public levelPermissions = [];
  public AclRoleAccesses = AclRoleAccesses;
  public indexedAccesses = {};
  public aclLevels: any[] = [];
  public indexedAclLevels = {};
  public onlyFullAccess = false;
  public AclLevels = {};
  public aclRoleConfigs = [];
  public levelAclRoleConfigs = [];

  private _destroy$ = new Subject();

  constructor(
    private readonly _appAclService: FsAppAclService,
    private readonly _dialogRef: MatDialogRef<FsAclRoleComponent>,
    private readonly _message: FsMessage,
    @Inject(MAT_DIALOG_DATA) private readonly _data: any,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    forkJoin(
      this.getRole(),
      this._appAclService.getPermissions(),
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe(([
        aclRole,
        aclPermissions,
      ]) => {

        this.permissions = aclPermissions;
        this.aclLevels = this._data.aclLevels;

        this.indexedAclLevels = list(this.aclLevels, 'name', 'value');
        this.indexedAccesses = list(AclRoleAccesses, 'name', 'value');

        this.aclRole = {
          ...{
            aclPermissions: [],
            allPermissions: true,
            aclRoleConfigs: [],
            permissions: {},
            level: this.aclLevels[0].value,
          },
          ...aclRole,
        };

        if (this.aclRole.id) {
          this.permissions.forEach((permission) => {
            let access = 0;

            const aclPermission = this.aclRole.aclPermissions.find((item) => {
              return item.permission === permission.value;
            });

            if (aclPermission) {
              access = aclPermission.access;
            }

            this.aclRole.permissions[permission.value] = access;
          });
        }

        if (this.aclRole.allPermissions) {
          this._applyMaxPermissionAccess();
        }

        this._updatePermissions();
        this._updateAclRoleConfigs();

        this._cdRef.markForCheck();
      });

    this.listConfig = {
      status: false,
      paging: false,
      noResults: {
        message: '',
      },
      group: {
        initialExpand: true,
        groupBy: (data) => {
          return data;
        },
        compareBy: (data) => {
          return data.category || 'General';
        },
      },
      fetch: () => {
        return of({
          data: this.levelPermissions.sort((a, b) => {
            a = a.name.toUpperCase();
            b = b.name.toUpperCase();
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            }

            return 0;
          }),
        });
      },
    };
  }

  public levelChange(): void {
    this._updatePermissions();
    this._updateAclRoleConfigs();
    setTimeout(() => {
      this.list.reload();
    });
  }

  public getRole(): Observable<any> {
    if (!this._data.aclRole.id) {
      return of(this._data.aclRole);
    }

    const query: any = {
      aclPermissions: true,
      aclRoleConfigs: true,
    };

    if (!this.environment) {
      query.environmentId = null;
    }

    return this._data.loadAclRole(this._data.aclRole, query)
      .pipe(
        map((data) => this._appAclService.input(data)),
      );
  }

  public save = (): Observable<any> => {
    const aclRole = {
      ...this.aclRole,
      permissions: this.levelPermissions.map((permission) => {
        return {
          value: permission.value,
          access: this.aclRole.permissions[permission.value] || 0,
        };
      }),
      aclRoleConfigs: this.levelAclRoleConfigs.map((item) => {
        return {
          id: item.id,
          value: item.value,
          data: item.data,
        };
      }),
    };

    return this._data.saveAclRole(this._appAclService.output(aclRole))
      .pipe(
        tap((response) => {
          this._message.success('Saved Changes');
          this.close(response);
        }),
      );
  }

  public close(data: any = null): void {
    this._dialogRef.close(data);
  }

  public allPermissionsChange(all: boolean): void {
    this._updatePermissions();
    if (all) {
      this._applyMaxPermissionAccess();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updatePermissions(): void {
    this.levelPermissions = this.permissions.filter((permission) => {
      return permission.levels.some((item) => {
        return item === this.aclRole.level;
      });
    });
  }

  private _updateAclRoleConfigs(): void {
    this.levelAclRoleConfigs = this.aclRoleConfigs.filter((item) => {
      return this.aclRole.level === item.level;
    });
  }

  private _applyMaxPermissionAccess(): void {
    this.permissions.forEach((permission) => {
      this.aclRole.permissions[permission.value] = Math.max(...permission.accesses);
    });
  }

}
