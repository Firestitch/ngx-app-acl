import { takeUntil, filter, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';
import { list } from '@firestitch/common';

import { Subject, Observable } from 'rxjs';

import { AclRole, AclLevel } from './../../interfaces';
import { FsAclRoleComponent } from '../acl-role/acl-role.component';
import { FsAppAclService } from '../../services';

@Component({
  selector: 'fs-acl-roles',
  templateUrl: 'acl-roles.component.html',
  styleUrls: [ 'acl-roles.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAclRolesComponent implements OnInit, OnDestroy {

  @Input() deleteAclRole: (aclRole: AclRole) => Observable<AclRole>;
  @Input() saveAclRole: (aclRole: AclRole) => Observable<AclRole>;
  @Input() loadAclRoles: (query: any) => Observable<{ data: AclRole[], paging: any }>;
  @Input() loadAclRole: (aclRole: AclRole, query) => Observable<AclRole>;
  @Input() aclLevels: AclLevel[] = [];

  @ViewChildren(FsListComponent)
  public list = new QueryList<FsListComponent>();

  public listConfig: FsListConfig;
  public permissions;
  public indexedAclRoleLevels: { [value: string]: string } = {};

  private _destroy$ = new Subject();

  constructor(
    private readonly _appAclService: FsAppAclService,
    private readonly _dialog: MatDialog,
    private readonly _cdRef: ChangeDetectorRef,
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

    const dialogRef = this._dialog.open(FsAclRoleComponent, {
      width: '70%',
      data: {
        aclRole,
        aclLevels: this.aclLevels,
        loadAclRole: this.loadAclRole,
        saveAclRole: this.saveAclRole,
      },
    });

    dialogRef.afterClosed()
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
    this._destroy$.next();
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
          label: 'Show Deleted',
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
            return this.deleteAclRole(this._appAclService.output(data));
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this role?',
          },
          menu: true,
          label: 'Delete',
          show: (row) => row.state !== 'deleted',
        },
      ],
      fetch: (query) => {
        query.permissions = true;
        return this.loadAclRoles(query)
          .pipe(
            map((data) => this._appAclService.input(data))
          );
      },
    };
  }

}
