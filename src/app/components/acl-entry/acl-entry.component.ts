import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { forkJoin } from 'rxjs';

import { AclRole} from './../../interfaces/acl-role';
import { AclEntryData } from './../../interfaces/acl-entry-data';
import { AclObjectRole } from './../../interfaces/acl-object-role';
import { AclObjectEntry } from './../../interfaces/acl-object-entry';
import { AclEntry } from './../../interfaces/acl-entry';
import { FsAppAclService } from './../../services/app-acl.service';


@Component({
  templateUrl: './acl-entry.component.html',
  styleUrls: ['./acl-entry.component.scss'],
})
export class FsAclEntryComponent implements OnInit {

  public aclRoles: AclRole[] = [];
  public aclObjectEntry: AclObjectEntry;
  public aclObjectRole: AclObjectRole;
  public aclEntries: AclEntry[] = [];
  public indexedAclRoleLevels = {};
  public titleEdit = 'Edit Roles';
  public titleAdd = 'Assign Roles';
  public required = true;

  constructor(
    private readonly _appAclService: FsAppAclService,
    private readonly _dialogRef: MatDialogRef<FsAclEntryComponent>,
    private readonly _message: FsMessage,
    @Inject(MAT_DIALOG_DATA) private readonly _data: AclEntryData
  ) {
    this.aclObjectEntry = { ..._data.aclObjectEntry };
    this.required = _data.required ?? true;

    if (_data.titleEdit) {
      this.titleEdit = _data.titleEdit;
    }

    if (_data.titleAdd) {
      this.titleAdd = _data.titleAdd;
    }
  }

  public ngOnInit() {
    forkJoin(
      this._data.loadAclRoles(this.aclObjectEntry),
      this._appAclService.getIndexedLevels()
    )
      .subscribe(([
        aclRoles,
        levels,
      ]) => {

        this.aclRoles = aclRoles;
        this.indexedAclRoleLevels = levels;

        this.aclObjectRole = {
          object: this.aclObjectEntry.object,
          aclRoles: this.aclObjectEntry.aclEntries
                    .map((aclEntry: AclEntry) => {
                      return aclEntry.aclRole;
                    }),
        };
      });
  }

  public aclObjectRoleChange(aclObjectRoles: AclObjectRole[]) {
    this.aclEntries = aclObjectRoles.reduce((aclEntries, aclObjectRole) => {
      aclObjectRole.aclRoles.forEach(aclRole => {
        aclEntries.push({
          aclRoleId: aclRole.id,
          aclRole: aclRole,
          objectId: aclObjectRole.object ? aclObjectRole.object.id : null,
          object: aclObjectRole.object || null
        });
      });

      return aclEntries;
    }, []);
  }

  public save = () => {
    const aclObjectEntry = {
      ...this.aclObjectEntry,
      aclEntries: this.aclEntries,
    };

    return this._data.saveAclObjectEntry(aclObjectEntry)
      .subscribe((data) => {
        this._message.success('Saved Changes');
        this.close(data);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

}
