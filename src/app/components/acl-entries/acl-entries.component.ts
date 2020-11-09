import { takeUntil, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject, Observable } from 'rxjs';

import { sortBy, groupBy, forOwn } from 'lodash-es';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsAppAclService } from '../../services';
import { AclEntry, AclEntryData, AclRole, AclObjectEntry } from '../../interfaces';
import { FsAclEntryComponent } from '../acl-entry';
import { FsPrompt } from '@firestitch/prompt';


@Component({
  selector: 'fs-acl-entries',
  templateUrl: './acl-entries.component.html',
  styleUrls: ['./acl-entries.component.scss']
})
export class FsAclEntriesComponent implements OnInit, OnDestroy {

  @Input() loadAclEntries: (query: any) => Observable<AclEntry[]>;
  @Input() loadAclRoles: (query: any) => Observable<AclRole[]>;
  @Input() saveAclObjectEntry: (aclObjectEntry: AclObjectEntry) => Observable<any>;

  @ViewChild(FsListComponent)
  public aclEntriesList: FsListComponent = null;

  public aclEntriesConfig: FsListConfig = null;
  public permissions: any[] = [];

  private _destroy$ = new Subject();

  constructor(
    private readonly _appAclService: FsAppAclService,
    private readonly _dialog: MatDialog,
    private _confirm: FsPrompt,
  ) {}

  public ngOnInit() {

    this._appAclService.getPermissions()
      .subscribe(response => {
        this.permissions = response;
      });


    this.aclEntriesConfig = {
      status: false,
      paging: false,
      scrollable: false,
      rowActions: [
        {
          label: 'Edit',
          click: (aclObjectEntry: AclObjectEntry) => {
            this.update(aclObjectEntry);
          }
        },
        {
          label: 'Remove All Roles',
          click: (aclObjectEntry: AclObjectEntry) => {
            this._confirm
              .confirm({
                title: 'Remove All Roles',
                template: 'Are you sure you would like to remove all roles?',
              }).subscribe(() => {
                const data = this._appAclService.output({ ...aclObjectEntry, aclEntries: [] });
                this.saveAclObjectEntry(data)
                  .subscribe(() => {
                    this.aclEntriesList.reload();
                  });
              });
          }
        }
      ],
      fetch: (query) => {
        return new Observable((observer) => {
          this.loadAclEntries({
            aclRoles: true,
            aclRolePermissions: true,
            objects: true,
            aclRoleState: 'active',
          })
            .pipe(
              map((response) => this._appAclService.input(response)),
            )
            .subscribe((aclEntries: AclEntry[]) => {
              const objects = {};
              aclEntries.forEach((aclEntry: AclEntry) => {
                objects[aclEntry.objectId] = aclEntry.object;
              });

              let aclObjectEntry: AclObjectEntry[] = [];
              const grouped = groupBy(aclEntries, (item) => {
                return [item.aclRole.level, item.objectId];
              });

              forOwn(grouped, (group, key) => {
                key = key.split(',');
                aclObjectEntry.push({ object: objects[key[1]], level: key[0], aclEntries: group });
              });

              const hasApp = aclObjectEntry.some((item) => {
                return item.aclEntries.some((entry) => {
                  return !entry.objectId;
                });
              });

              if (!hasApp) {
                aclObjectEntry.unshift({ object: null, aclEntries: [], level: 'app' });
              }

              aclObjectEntry = sortBy(aclObjectEntry, (item: AclObjectEntry) => {
                return item.object ? item.level : '';
              });

              observer.next({ data: aclObjectEntry });
              observer.complete();
            });
        });
      },
    };
  }

  public update(aclObjectEntry: AclObjectEntry) {

    const data: AclEntryData = {
      aclObjectEntry: aclObjectEntry,
      required: false,
      loadAclRoles: this.loadAclRoles,
      saveAclObjectEntry: this.saveAclObjectEntry
    }

    this._dialog.open(FsAclEntryComponent, {
      data: data
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.aclEntriesList.reload();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
