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
import { AclRole } from './../../interfaces/acl-role';
import { takeUntil, tap } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import { list } from '@firestitch/common';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { forkJoin, Observable, of, Subject } from 'rxjs';
import { FsAppAclService } from './../../services/app-acl.service';
import { RoleConfig } from '../../interfaces';
import { AclRoleAccess } from '../../enums/acl-role-access';
import { MatButton } from '@angular/material/button';


@Component({
  templateUrl: './acl-role.component.html',
  styleUrls: ['./acl-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAclRoleComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  @ViewChild('submit', { static: false })
  public submitButton: MatButton;

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
  public roleConfigs: RoleConfig[] = [];
  public aclRoleConfigValues = {};
  public aclRolePermissions = {};
  public loadRoleConfigs: (aclRole: AclRole, query) => Observable<RoleConfig[]>;
  public disabled: boolean;

  private _destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly _data: any,
    private readonly _appAclService: FsAppAclService,
    private readonly _dialogRef: MatDialogRef<FsAclRoleComponent>,
    private readonly _message: FsMessage,
    private _cdRef: ChangeDetectorRef,
  ) { }

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
        this.disabled = this._data.disabled;

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

        this.aclRoleConfigValues = (aclRole.aclRoleConfigs || [])
          .reduce((accum, aclRoleConfig) => {
            return {
              ...accum,
              [aclRoleConfig.name]: aclRoleConfig.value,
            }
          }, {});

        if (this.aclRole.id) {
          this.permissions.forEach((permission) => {
            let access = 0;

            const aclPermission = this.aclRole.aclPermissions.find((item) => {
              return item.permission === permission.value;
            });

            if (aclPermission) {
              access = aclPermission.access;
            }

            this.aclRolePermissions[permission.value] = access;
          });
        }

        if (this.aclRole.allPermissions) {
          this._applyMaxPermissionAccess();
        }

        this._updatePermissions();
        this._updateRoleConfigs();

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

  public bulkChange(value: number, groupChildren, group): void {
    groupChildren
      .forEach((permission) => {
        const access = permission.accesses
          .find((access) => value === access);

        if(access || !value) {
          this.aclRolePermissions[permission.value] = value;
        }
      });

    setTimeout(() => {
      this.submitButton.disabled = false;
      this._cdRef.markForCheck();
    });
  }

  public levelChange(): void {
    this._updatePermissions();
    this._updateRoleConfigs();
    this.list.reload();
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

    return this._data.loadAclRole(this._data.aclRole, query);
  }

  public save = (): Observable<any> => {
    const aclRoleConfigs = this.roleConfigs
      .map((roleConfig) => {
        return {
          name: roleConfig.name,
          value: this.aclRoleConfigValues[roleConfig.name],
        }
      });

    const aclRole = {
      ...this.aclRole,
      permissions: this.levelPermissions.map((permission) => {
        return {
          value: permission.value,
          access: this.aclRolePermissions[permission.value] || 0,
        };
      }),
      aclRoleConfigs,
    };

    return this._data.saveAclRole(aclRole)
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
    } else {
      this._applyNonePermissionAccess();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updatePermissions(): void {
    this.levelPermissions = this.permissions
    .filter((permission) => {
      return permission.levels.some((item) => {
        return item === this.aclRole.level;
      });
    });
  }

  private _updateRoleConfigs(): void {
    if(this._data.loadRoleConfigs) {
      this._data.loadRoleConfigs()
      .subscribe((roleConfigs: RoleConfig[]) => {
        this.roleConfigs = roleConfigs
          .filter((roleConfig) => roleConfig.level === this.aclRole.level);
        this._cdRef.markForCheck();
      });
    }
  }

  private _applyMaxPermissionAccess(): void {
    this.permissions.forEach((permission) => {
      this.aclRolePermissions[permission.value] = Math.max(...permission.accesses);
    });
  }

  private _applyNonePermissionAccess(): void {
    this.permissions.forEach((permission) => {
      this.aclRolePermissions[permission.value] = AclRoleAccess.None;
    });
  }

}
