import { AclObjectEntry } from './../../../../src/app/interfaces/acl-object-entry';
import { filter, map } from 'rxjs/operators';
import { AclRole } from '@firestitch/package';
import { Component, OnInit } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { of } from 'rxjs';
import { query } from '@angular/animations';
import { getQueryPredicate } from '@angular/compiler/src/render3/view/util';
import { AclObjectRole } from 'package/public_api';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent implements OnInit {

  public config = {};
  public aclObjectRole: AclObjectRole = {
    object: null,
    aclRoles: [],
    level: 'app'
  };
  public aclRoles: AclRole[] = [];
  public aclEntries: any = [{ "account": { "address": null, "name": "00-Area Role Edmonton", "image": { "tiny": "http:\/\/firestitch-local.s3.amazonaws.com\/pub\/ai\/tiny\/8e8d9f779b6f2a7a70402f150d4acdd4_1580915980.png", "small": "http:\/\/firestitch-local.s3.amazonaws.com\/pub\/ai\/small\/8e8d9f779b6f2a7a70402f150d4acdd4_1580915980.png" }, "workspaces": [], "id": 76, "state": "active", "guid": "8e8d9f779b6f2a7a70402f150d4acdd4", "email": "ray+3@firestitch.com", "firstName": "00-Area Role", "lastName": "Edmonton", "phone": null, "createDate": "2019-09-01T14:54:12+00:00", "signinDate": "2020-05-26T14:59:44+00:00", "imageType": "acronym", "activateEmailDate": "2019-09-01T14:54:14+00:00", "activateEmailMessage": null, "lastDigestDate": "2020-05-21T21:18:12+00:00", "activateDate": "2019-12-21T13:04:51+00:00", "passwordChange": false, "digestDate": "", "digestFrequency": "1", "timezone": "America\/Toronto", "apiKey": null, "apiSecret": null, "type": "staff", "approvalNotificationSchedule": [6, 7, 8, 17] }, "aclRole": { "aclPermissions": [{ "id": 147, "aclRoleId": 9, "permission": "director_approval", "access": 15 }, { "id": 148, "aclRoleId": 9, "permission": "ops_approval", "access": 15 }], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 9, "environmentId": null, "name": "Director", "state": "active", "level": "area", "allPermissions": false, "protected": false }, "object": { "className": "Area", "modifierAccount": null, "id": 692, "class": "area", "subclass": null, "name": "200", "imageUrl": null, "modifyDate": "2020-04-24T16:17:36+00:00", "createDate": "2019-11-26T17:36:59+00:00", "state": "active", "meta": {}, "workspaceId": null }, "id": 147, "aclRoleId": 9, "accountId": 76, "objectId": 692, "environmentId": null }, { "account": { "address": null, "name": "00-Area Role Edmonton", "image": { "tiny": "http:\/\/firestitch-local.s3.amazonaws.com\/pub\/ai\/tiny\/8e8d9f779b6f2a7a70402f150d4acdd4_1580915980.png", "small": "http:\/\/firestitch-local.s3.amazonaws.com\/pub\/ai\/small\/8e8d9f779b6f2a7a70402f150d4acdd4_1580915980.png" }, "workspaces": [], "id": 76, "state": "active", "guid": "8e8d9f779b6f2a7a70402f150d4acdd4", "email": "ray+3@firestitch.com", "firstName": "00-Area Role", "lastName": "Edmonton", "phone": null, "createDate": "2019-09-01T14:54:12+00:00", "signinDate": "2020-05-26T14:59:44+00:00", "imageType": "acronym", "activateEmailDate": "2019-09-01T14:54:14+00:00", "activateEmailMessage": null, "lastDigestDate": "2020-05-21T21:18:12+00:00", "activateDate": "2019-12-21T13:04:51+00:00", "passwordChange": false, "digestDate": "", "digestFrequency": "1", "timezone": "America\/Toronto", "apiKey": null, "apiSecret": null, "type": "staff", "approvalNotificationSchedule": [6, 7, 8, 17] }, "aclRole": { "aclPermissions": [{ "id": 149, "aclRoleId": 25, "permission": "admin", "access": 0 }, { "id": 150, "aclRoleId": 25, "permission": "item_override", "access": 15 }, { "id": 151, "aclRoleId": 25, "permission": "selet_past_pay_periods", "access": 15 }, { "id": 152, "aclRoleId": 25, "permission": "system", "access": 0 }], "permissions": [{ "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }], "id": 25, "environmentId": null, "name": "Item Override + Select Past Pa", "state": "active", "level": "app", "allPermissions": false, "protected": false }, "object": null, "id": 325, "aclRoleId": 25, "accountId": 76, "objectId": null, "environmentId": null }];

  constructor(private exampleComponent: FsExampleComponent,
              private message: FsMessage) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }

  public loadAclRoles = () => {
    return of({ "paging": { "limit": 25, "records": 12, "offset": 0 }, "data": [{ "aclPermissions": [{ "id": 138, "aclRoleId": 2, "permission": "admin", "access": 15 }, { "id": 139, "aclRoleId": 2, "permission": "item_override", "access": 0 }, { "id": 140, "aclRoleId": 2, "permission": "system", "access": 15 }], "permissions": [{ "value": "admin", "name": "Admin", "access": 15 }, { "value": "system", "name": "System", "access": 15 }], "id": 2, "environmentId": null, "name": "Admin Role", "state": "active", "level": "app", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 141, "aclRoleId": 15, "permission": "system", "access": 15 }, { "id": 142, "aclRoleId": 15, "permission": "admin", "access": 15 }, { "id": 143, "aclRoleId": 15, "permission": "item_override", "access": 15 }], "permissions": [{ "value": "system", "name": "System", "access": 15 }, { "value": "admin", "name": "Admin", "access": 15 }, { "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }], "id": 15, "environmentId": null, "name": "App Full Access", "state": "active", "level": "app", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 149, "aclRoleId": 25, "permission": "admin", "access": 0 }, { "id": 150, "aclRoleId": 25, "permission": "item_override", "access": 15 }, { "id": 151, "aclRoleId": 25, "permission": "selet_past_pay_periods", "access": 15 }, { "id": 152, "aclRoleId": 25, "permission": "system", "access": 0 }], "permissions": [{ "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }], "id": 25, "environmentId": null, "name": "Item Override + Select Past Pa", "state": "active", "level": "app", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 179, "aclRoleId": 1, "permission": "admin", "access": 15 }, { "id": 180, "aclRoleId": 1, "permission": "item_override", "access": 15 }, { "id": 181, "aclRoleId": 1, "permission": "selet_past_pay_periods", "access": 15 }, { "id": 182, "aclRoleId": 1, "permission": "system", "access": 15 }], "permissions": [{ "value": "admin", "name": "Admin", "access": 15 }, { "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }, { "value": "system", "name": "System", "access": 15 }], "id": 1, "environmentId": null, "name": "System Role", "state": "active", "level": "app", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 135, "aclRoleId": 13, "permission": "item_override", "access": 0 }, { "id": 136, "aclRoleId": 13, "permission": "vp_approval", "access": 15 }, { "id": 137, "aclRoleId": 13, "permission": "sage", "access": 15 }], "permissions": [{ "value": "vp_approval", "name": "VP Approval", "access": 15 }, { "value": "sage", "name": "Sage", "access": 15 }], "id": 13, "environmentId": null, "name": "Sage", "state": "active", "level": "company", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 29, "aclRoleId": 12, "permission": "system", "access": 0 }, { "id": 30, "aclRoleId": 12, "permission": "admin", "access": 0 }, { "id": 31, "aclRoleId": 12, "permission": "vp_approval", "access": 15 }, { "id": 32, "aclRoleId": 12, "permission": "director_approval", "access": 0 }, { "id": 33, "aclRoleId": 12, "permission": "ops_approval", "access": 0 }, { "id": 34, "aclRoleId": 12, "permission": "include_order_notify", "access": 0 }], "permissions": [{ "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }, { "value": "vp_approval", "name": "VP Approval", "access": 15 }, { "value": "sage", "name": "Sage", "access": 15 }], "id": 12, "environmentId": null, "name": "VP", "state": "active", "level": "company", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 103, "aclRoleId": 11, "permission": "director_approval", "access": 15 }, { "id": 104, "aclRoleId": 11, "permission": "ops_approval", "access": 15 }], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 11, "environmentId": null, "name": "Area Role", "state": "active", "level": "area", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 147, "aclRoleId": 9, "permission": "director_approval", "access": 15 }, { "id": 148, "aclRoleId": 9, "permission": "ops_approval", "access": 15 }], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 9, "environmentId": null, "name": "Director", "state": "active", "level": "area", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 11, "aclRoleId": 6, "permission": "system", "access": 0 }, { "id": 12, "aclRoleId": 6, "permission": "admin", "access": 0 }, { "id": 13, "aclRoleId": 6, "permission": "vp_approval", "access": 0 }, { "id": 14, "aclRoleId": 6, "permission": "director_approval", "access": 0 }, { "id": 15, "aclRoleId": 6, "permission": "ops_approval", "access": 15 }, { "id": 16, "aclRoleId": 6, "permission": "include_order_notify", "access": 0 }, { "id": 58, "aclRoleId": 6, "permission": "item_override", "access": 0 }, { "id": 59, "aclRoleId": 6, "permission": "sage", "access": 0 }], "permissions": [{ "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 6, "environmentId": null, "name": "Ops Manager", "state": "active", "level": "area", "allPermissions": false, "protected": false }, { "aclPermissions": [], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 16, "environmentId": null, "name": "VP", "state": "active", "level": "area", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 183, "aclRoleId": 7, "permission": "include_order_notify", "access": 5 }], "permissions": [{ "value": "include_order_notify", "name": "Include In Work Order Notifications", "access": 5 }], "id": 7, "environmentId": null, "name": "Site Manager", "state": "active", "level": "client_account", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 171, "aclRoleId": 5, "permission": "include_order_notify", "access": 0 }], "permissions": [], "id": 5, "environmentId": null, "name": "Contact Role", "state": "active", "level": "contact", "allPermissions": false, "protected": false }] });
  }

  public loadAclRole = (id, query) => {
    return of({ "aclPermissions": [{ "id": 138, "aclRoleId": 2, "permission": "admin", "access": 15 }, { "id": 139, "aclRoleId": 2, "permission": "item_override", "access": 0 }, { "id": 140, "aclRoleId": 2, "permission": "system", "access": 15 }], "permissions": [{ "value": "admin", "name": "Admin", "access": 15 }, { "value": "system", "name": "System", "access": 15 }], "id": 2, "environmentId": null, "name": "Admin Role", "state": "active", "level": "app", "allPermissions": false, "protected": false });
  }

  public deleteAclRole = (aclRole: AclRole) => {
    return of(aclRole);
  }

  public saveAclRole = (aclRole: AclRole) => {
    return of(aclRole);
  }

  public loadAclEntries = (query) => {
    return of(this.aclEntries);
  }

  public loadAclEntriesRoles = (query: any) => {
    return of([{ "aclPermissions": [{ "id": 138, "aclRoleId": 2, "permission": "admin", "access": 15 }, { "id": 139, "aclRoleId": 2, "permission": "item_override", "access": 0 }, { "id": 140, "aclRoleId": 2, "permission": "system", "access": 15 }], "permissions": [{ "value": "admin", "name": "Admin", "access": 15 }, { "value": "system", "name": "System", "access": 15 }], "id": 2, "environmentId": null, "name": "Admin Role", "state": "active", "level": "app", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 141, "aclRoleId": 15, "permission": "system", "access": 15 }, { "id": 142, "aclRoleId": 15, "permission": "admin", "access": 15 }, { "id": 143, "aclRoleId": 15, "permission": "item_override", "access": 15 }], "permissions": [{ "value": "system", "name": "System", "access": 15 }, { "value": "admin", "name": "Admin", "access": 15 }, { "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }], "id": 15, "environmentId": null, "name": "App Full Access", "state": "active", "level": "app", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 149, "aclRoleId": 25, "permission": "admin", "access": 0 }, { "id": 150, "aclRoleId": 25, "permission": "item_override", "access": 15 }, { "id": 151, "aclRoleId": 25, "permission": "selet_past_pay_periods", "access": 15 }, { "id": 152, "aclRoleId": 25, "permission": "system", "access": 0 }], "permissions": [{ "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }], "id": 25, "environmentId": null, "name": "Item Override + Select Past Pa", "state": "active", "level": "app", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 179, "aclRoleId": 1, "permission": "admin", "access": 15 }, { "id": 180, "aclRoleId": 1, "permission": "item_override", "access": 15 }, { "id": 181, "aclRoleId": 1, "permission": "selet_past_pay_periods", "access": 15 }, { "id": 182, "aclRoleId": 1, "permission": "system", "access": 15 }], "permissions": [{ "value": "admin", "name": "Admin", "access": 15 }, { "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }, { "value": "system", "name": "System", "access": 15 }], "id": 1, "environmentId": null, "name": "System Role", "state": "active", "level": "app", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 135, "aclRoleId": 13, "permission": "item_override", "access": 0 }, { "id": 136, "aclRoleId": 13, "permission": "vp_approval", "access": 15 }, { "id": 137, "aclRoleId": 13, "permission": "sage", "access": 15 }], "permissions": [{ "value": "vp_approval", "name": "VP Approval", "access": 15 }, { "value": "sage", "name": "Sage", "access": 15 }], "id": 13, "environmentId": null, "name": "Sage", "state": "active", "level": "company", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 29, "aclRoleId": 12, "permission": "system", "access": 0 }, { "id": 30, "aclRoleId": 12, "permission": "admin", "access": 0 }, { "id": 31, "aclRoleId": 12, "permission": "vp_approval", "access": 15 }, { "id": 32, "aclRoleId": 12, "permission": "director_approval", "access": 0 }, { "id": 33, "aclRoleId": 12, "permission": "ops_approval", "access": 0 }, { "id": 34, "aclRoleId": 12, "permission": "include_order_notify", "access": 0 }], "permissions": [{ "value": "item_override", "name": "Item Override", "access": 15 }, { "value": "selet_past_pay_periods", "name": "Select Past Pay Periods  ", "access": 15 }, { "value": "vp_approval", "name": "VP Approval", "access": 15 }, { "value": "sage", "name": "Sage", "access": 15 }], "id": 12, "environmentId": null, "name": "VP", "state": "active", "level": "company", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 103, "aclRoleId": 11, "permission": "director_approval", "access": 15 }, { "id": 104, "aclRoleId": 11, "permission": "ops_approval", "access": 15 }], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 11, "environmentId": null, "name": "Area Role", "state": "active", "level": "area", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 147, "aclRoleId": 9, "permission": "director_approval", "access": 15 }, { "id": 148, "aclRoleId": 9, "permission": "ops_approval", "access": 15 }], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 9, "environmentId": null, "name": "Director", "state": "active", "level": "area", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 11, "aclRoleId": 6, "permission": "system", "access": 0 }, { "id": 12, "aclRoleId": 6, "permission": "admin", "access": 0 }, { "id": 13, "aclRoleId": 6, "permission": "vp_approval", "access": 0 }, { "id": 14, "aclRoleId": 6, "permission": "director_approval", "access": 0 }, { "id": 15, "aclRoleId": 6, "permission": "ops_approval", "access": 15 }, { "id": 16, "aclRoleId": 6, "permission": "include_order_notify", "access": 0 }, { "id": 58, "aclRoleId": 6, "permission": "item_override", "access": 0 }, { "id": 59, "aclRoleId": 6, "permission": "sage", "access": 0 }], "permissions": [{ "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 6, "environmentId": null, "name": "Ops Manager", "state": "active", "level": "area", "allPermissions": false, "protected": false }, { "aclPermissions": [], "permissions": [{ "value": "director_approval", "name": "Director Approval", "access": 15 }, { "value": "ops_approval", "name": "Ops Approval", "access": 15 }], "id": 16, "environmentId": null, "name": "VP", "state": "active", "level": "area", "allPermissions": true, "protected": false }, { "aclPermissions": [{ "id": 183, "aclRoleId": 7, "permission": "include_order_notify", "access": 5 }], "permissions": [{ "value": "include_order_notify", "name": "Include In Work Order Notifications", "access": 5 }], "id": 7, "environmentId": null, "name": "Site Manager", "state": "active", "level": "client_account", "allPermissions": false, "protected": false }, { "aclPermissions": [{ "id": 171, "aclRoleId": 5, "permission": "include_order_notify", "access": 0 }], "permissions": [], "id": 5, "environmentId": null, "name": "Contact Role", "state": "active", "level": "contact", "allPermissions": false, "protected": false }])
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
    this.loadAclRoles()
      .subscribe(data => {
        this.aclRoles = data.data;
      });
  }
}