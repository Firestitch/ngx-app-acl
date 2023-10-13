import { AclEntry } from './../../../../src/app/interfaces/acl-entry';
import { map } from 'rxjs/operators';
import { AclRole } from '@firestitch/package';
import { Component, OnInit } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { Observable, of } from 'rxjs';
import { AclObjectRole } from './../../../../src/app/interfaces/acl-object-role';
import { AclObjectEntry } from './../../../../src/app/interfaces/acl-object-entry';
import { AclRoleConfig } from 'src/app/interfaces/acl-role-config';
import { RoleConfig } from 'src/app/interfaces';


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss']
})
export class KitchenSinkComponent implements OnInit {

  public config = {};
  public aclObjectRole: AclObjectRole;
  public aclObjectRoleMultiple: AclObjectRole = {
    object: { name: 'Project X', id: 1 },
    aclRoles: []
  };
  public aclRoles: AclRole[] = [];
  public aclEntries: AclEntry[];

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
  ) {
    this.aclObjectRole = {
      object: null,
      aclRoles: [
        this._aclRoles[0],
        this._aclRoles[1],
      ]
    };

    this.aclEntries = [
      {
        id: 1,
        aclRole: this._aclRoles[0],
        environmentId: null,
      },
      {
        id: 2,
        objectId: 10,
        environmentId: 33,
        object: {
          name: 'Workspace',
          id: 10,
        },
        environment: {
          name: 'Organization A',
          id: 33,
        },
        aclRole: this._aclRoles[1],
      }
    ];
  }

  private _aclRoles: any = [
    {
      "aclPermissions": [
        { "id": 138, "aclRoleId": 2, "permission": "admin", "access": 15 },
        { "id": 139, "aclRoleId": 2, "permission": "item_override", "access": 0 },
        { "id": 140, "aclRoleId": 2, "permission": "system", "access": 15 }
      ],
      "permissions": [
        { "value": "admin", "name": "Admin", "access": 15 }, { "value": "system", "name": "System", "access": 15 }
      ],
      "description": "Description of the role",
      "id": 2, "environmentId": null, "name": "Admin Role", "state": "active", "level": "app", "allPermissions": false, "protected": false,
      aclRoleConfigs: [
        { 
          name: 'newMediaNotification',
          value: true
        }
      ] as AclRoleConfig[]
    },
    {
      "aclPermissions": [
        { "id": 141, "aclRoleId": 15, "permission": "system", "access": 15 },
        { "id": 142, "aclRoleId": 15, "permission": "admin", "access": 15 },
        { "id": 143, "aclRoleId": 15, "permission": "item_override", "access": 15 }
      ],
      "permissions": [
        { "value": "system", "name": "System", "access": 15 },
        { "value": "admin", "name": "Admin", "access": 15 },
        { "value": "item_override", "name": "Item Override", "access": 15 },
        { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }
      ],
      "id": 15, "environmentId": null, "name": "App Full Access", "state": "deleted", "level": "app", "allPermissions": true, "protected": false
    },
    {
      "aclPermissions": [
        { "id": 149, "aclRoleId": 25, "permission": "admin", "access": 0 },
        { "id": 150, "aclRoleId": 25, "permission": "item_override", "access": 15 },
        { "id": 151, "aclRoleId": 25, "permission": "selet_past_pay_periods", "access": 15 },
        { "id": 152, "aclRoleId": 25, "permission": "system", "access": 0 }
      ],
      "permissions": [
        { "value": "item_override", "name": "Item Override", "access": 15 },
        { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }
      ], 
      "id": 25, "environmentId": null, "name": "Item Override + Select Past Pa", "state": "active", "level": "app", "allPermissions": false, "protected": false
    },
  ];

  public loadAclRoles = (query) => {
    console.log('loadAclRoles', query);
    return of({ "paging": { "limit": 25, "records": 12, "offset": 0 }, "data": this._aclRoles });
  }

  public loadAclRole = (aclRole, query) => {
    return of(this._aclRoles.find((item) => {
      return item.id === aclRole.id;
    }));
  }

  public restoreAclRole = (aclRole: AclRole) => {
    return of(aclRole);
  }

  public deleteAclRole = (aclRole: AclRole) => {
    return of(aclRole);
  }

  public saveAclRole = (aclRole: AclRole) => {
    console.log('SaveAclRole', aclRole);
    return of(aclRole);
  }

  public loadAclEntries = (query) => {
    return of(this.aclEntries);
  }

  public loadRoleConfigs = (): Observable<RoleConfig[]> => {
    return of([
      { 
        type: 'checkbox', 
        label: 'Enable new media notifications on account creation', 
        name: 'newMediaNotification',
        level: 'app',
      }
    ]);
  }

  public loadAclEntriesRoles = (query: any) => {
    return of(this._aclRoles)
      .pipe(
        map((data: any) => {
          return data.filter(aclRole => {
              return aclRole.level === query.level;
            });
         })
      );
  }

  public saveAclObjectEntry = (aclObjectEntry: AclObjectEntry) => {

    this.aclEntries = this.aclEntries.filter((item: any) => {
      return aclObjectEntry.level !== item.aclRole.level;
    });

    this.aclEntries.push(...aclObjectEntry.aclEntries);

    return of(true);
  }

  ngOnInit() {
    this.loadAclRoles({})
      .subscribe(data => {
        this.aclRoles = data.data;
      });
  }
}
