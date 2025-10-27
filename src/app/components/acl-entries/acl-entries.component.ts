import { takeUntil, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject, Observable } from 'rxjs';

import { sortBy, groupBy } from 'lodash-es';

import { FsListAction, FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';

import { FsAppAclService } from '../../services/app-acl.service';
import { AclEntryData } from '../../interfaces/acl-entry-data';
import { AclEntry } from '../../interfaces/acl-entry';
import { AclRole } from '../../interfaces/acl-role';
import { AclObjectEntry } from '../../interfaces/acl-object-entry';
import { FsAclEntryComponent } from '../acl-entry/acl-entry.component';
import { FsBadgeModule } from '@firestitch/badge';
import { FsAclRolePopoverComponent } from '../acl-role-popover/acl-role-popover.component';


@Component({
    selector: 'fs-acl-entries',
    templateUrl: './acl-entries.component.html',
    styleUrls: ['./acl-entries.component.scss'],
    standalone: true,
    imports: [FsListModule, FsBadgeModule, FsAclRolePopoverComponent]
})
export class FsAclEntriesComponent implements OnInit, OnDestroy {

  @Input() public loadAclEntries: (query: any) => Observable<AclEntry[]>;
  @Input() public loadAclRoles: (query: any) => Observable<AclRole[]>;
  @Input() public saveAclObjectEntry: (aclObjectEntry: AclObjectEntry) => Observable<any>;
  @Input() public environmentShow = true;
  @Input() public environmentLabel = 'Environment';
  @Input() public environmentKey = 'environment';
  @Input() public actions: FsListAction[] = [];

  @ViewChild(FsListComponent)
  public aclEntriesList: FsListComponent = null;

  public aclEntriesConfig: FsListConfig = null;
  public permissions: any[] = [];

  private _destroy$ = new Subject();

  constructor(
    private readonly _appAclService: FsAppAclService,
    private readonly _dialog: MatDialog,
    private _confirm: FsPrompt,
  ) { }

  public ngOnInit(): void {
    this._appAclService.getPermissions()
      .subscribe(response => {
        this.permissions = response;
      });

    this.aclEntriesConfig = {
      status: false,
      paging: false,
      actions: this.actions,
      rowActions: [
        {
          label: 'Remove All Roles',
          click: (aclObjectEntry: AclObjectEntry) => {
            this._confirm
              .confirm({
                title: 'Remove All Roles',
                commitLabel: 'Save',
                template: `Please note that removing roles may prevent users from being able to successfully login.<br>
                  These changes are effective immediately.<br>
                  Are you sure you would like to continue?`,
              }).subscribe(() => {
                const data = { ...aclObjectEntry, aclEntries: [] };
                this.saveAclObjectEntry(data)
                  .subscribe(() => {
                    this.aclEntriesList.reload();
                  });
              });
          }
        }
      ],
      fetch: () => {
        return new Observable((observer) => {
          this.loadAclEntries({
            aclRoles: true,
            aclRolePermissions: true,
            objects: true,
            aclRoleState: 'active',
          })
            .subscribe((aclEntries: AclEntry[]) => {
              const objects = aclEntries
                .filter((aclEntry) => (!!aclEntry.object))
                .reduce((items, item) => {
                  return {
                    ...items,
                    [item.object.id]: item.object,
                  };
                }, {});

              const environments = aclEntries
                .filter((aclEntry) => (!!aclEntry[this.environmentKey]))
                .reduce((items, item) => {
                  const environment = item[this.environmentKey];
                  return {
                    ...items,
                    [environment.id]: environment,
                  };
                }, {});

              const groupedAclEntries = groupBy(aclEntries, (item) => {
                const environmentId = (item[this.environmentKey])?.id;
                return [item.aclRole.level, environmentId, item.objectId];
              });

              let aclObjectEntries: AclObjectEntry[] = Object.keys(groupedAclEntries)
                .reduce((accum, key: any) => {
                  const parts = key.split(',');
                  return [
                    ...accum,
                    {
                      object: objects[parts[2]],
                      level: parts[0],
                      [`${this.environmentKey}Id`]: parts[1] ? parseInt(parts[1]) : null,
                      [this.environmentKey]: environments[parts[1]],
                      aclEntries: groupedAclEntries[key],
                    }
                  ];
                }, []);

              const hasApp = aclObjectEntries.some((item) => {
                return item.aclEntries.some((entry) => {
                  return !entry.objectId;
                });
              });

              if (!hasApp) {
                aclObjectEntries.unshift({
                  object: null,
                  aclEntries: [],
                  level: 'app',
                  environmentId: null,
                });
              }

              aclObjectEntries = sortBy(aclObjectEntries, (item: AclObjectEntry) => {
                return item.object ? item.level : '';
              });

              observer.next({ data: aclObjectEntries });
              observer.complete();
            });
        });
      },
    };
  }

  public update(aclObjectEntry: AclObjectEntry) {
    const data: AclEntryData = {
      aclObjectEntry,
      required: false,
      loadAclRoles: this.loadAclRoles,
      saveAclObjectEntry: this.saveAclObjectEntry
    }

    this._dialog.open(FsAclEntryComponent, {
      data: data
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.aclEntriesList.reload();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public reload(): void {
    this.aclEntriesList.reload();
  }

}
