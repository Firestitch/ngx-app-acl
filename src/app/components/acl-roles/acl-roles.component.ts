import { takeUntil, filter, map, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';
import { list } from '@firestitch/common';

import { Subject, Observable } from 'rxjs';

import { AclRole } from './../../interfaces/acl-role';
import { AclLevel } from './../../interfaces/acl-level';
import { FsAclRoleComponent } from '../acl-role/acl-role.component';
import { FsAppAclService } from '../../services/app-acl.service';
import { RoleConfig } from '../../interfaces';


@Component({
  selector: 'fs-acl-roles',
  templateUrl: 'acl-roles.component.html',
  styleUrls: [ 'acl-roles.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAclRolesComponent implements OnInit, OnDestroy {

  @Input() deleteAclRole: (aclRole: AclRole) => Observable<AclRole>;
  @Input() restoreAclRole: (aclRole: AclRole) => Observable<AclRole>;
  @Input() saveAclRole: (aclRole: AclRole) => Observable<AclRole>;
  @Input() loadAclRoles: (query: any) => Observable<{ data: AclRole[], paging: any }>;
  @Input() loadAclRole: (aclRole: AclRole, query) => Observable<AclRole>;
  @Input() loadRoleConfigs: (aclRole: AclRole, query) => Observable<RoleConfig[]>;
  @Input() aclLevels: AclLevel[] = [];
  @Input()
  public disabledAclRole: (aclRole: AclRole) => boolean;

  @ViewChildren(FsListComponent)
  public list = new QueryList<FsListComponent>();

  public listConfig: FsListConfig;
  public permissions;
  public indexedAclRoleLevels: { [value: string]: string } = {};

  private _destroy$ = new Subject();

  constructor(
    private readonly _appAclService: FsAppAclService,
    private readonly _dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    new Observable(observer => {
      if (this.aclLevels.length) {
          observer.next(this.aclLevels);
          observer.complete();
      } else {

        this._appAclService.getLevels()
          .subscribe((aclLevels: AclLevel[]) => {
            observer.next(aclLevels);
            observer.complete();
          });
      }
    })
      .subscribe((aclLevels: AclLevel[]) => {
        this.aclLevels = aclLevels;
        this.indexedAclRoleLevels = list(this.aclLevels, 'name', 'value');
        this._loadListConfig();
      });
  }

  public openDialog(aclRole: AclRole = { id: null }): void {
    this._dialog.open(FsAclRoleComponent, {
      width: '70%',
      data: {
        aclRole,
        aclLevels: this.aclLevels,
        loadAclRole: this.loadAclRole,
        saveAclRole: this.saveAclRole,
        loadRoleConfigs: this.loadRoleConfigs,
        disabled: this.disabledAclRole
          ? this.disabledAclRole(aclRole)
          : false,

      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
        filter((response) => !!response),
      )
      .subscribe((response) => {
        this.list.forEach((list: FsListComponent) => {
          list.reload();
        });
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _loadListConfig() {
    this.listConfig = {
      sort: { value: 'hierarchy' },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
        {
          name: 'level',
          label: 'Level',
          type: ItemType.Select,
          values: this.aclLevels,
          hide: this.aclLevels.length <= 1
        },
        {
          name: 'state',
          label: 'Show deleted',
          type: ItemType.Checkbox,
          unchecked: 'active',
          checked: 'deleted',
        },
      ],
      actions: [
        {
          click: (event) => {
            this.openDialog();
          },
          label: 'Create',
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this.deleteAclRole(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this role?',
          },
          menu: true,
          label: 'Delete',
          show: (row) => {
            const hideDelete = !!this.disabledAclRole
              ? this.disabledAclRole(row)
              : false;

            return !!this.deleteAclRole
              && row.state !== 'deleted'
              && !hideDelete;
          },
        },
        {
          click: (data) => {
            return this.restoreAclRole(data)
              .pipe(
                tap(() => {
                  this.list.forEach((l: FsListComponent) => {
                    l.reload();
                  });
                }),
                takeUntil(this._destroy$),
              )
              .subscribe();
          },
          label: 'Restore',
          show: (row) => !!this.restoreAclRole && row.state === 'deleted',
        },
      ],
      fetch: (query) => {
        query.permissions = true;
        return this.loadAclRoles(query)
          .pipe(
            map((data) => data)
          );
      },
    };
  }

}
