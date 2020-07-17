import { ControlContainer, NgForm } from '@angular/forms';
import { Component, Input, EventEmitter, Output } from '@angular/core';

import { AclObjectRole, AclRole } from '../../interfaces';


@Component({
  selector: 'fs-acl-object-roles',
  templateUrl: './acl-object-roles.component.html',
  styleUrls: ['./acl-object-roles.component.scss'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class FsAclObjectRolesComponent {

  @Input() aclRoles: AclRole[] = [];
  @Input() required = false;
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() aclObjectRoles: AclObjectRole[] = [];
  @Input() rolesLabel = 'Roles';
  @Input() levelLabel = '';
  @Output() change = new EventEmitter<AclObjectRole[]>();

  public compareAclRole = (o1: any, o2: any) => {
    return o1 && o2 && o1.id === o2.id;
  }
}
