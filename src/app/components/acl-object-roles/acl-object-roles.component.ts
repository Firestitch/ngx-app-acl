import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import { Component, Input, EventEmitter, Output } from '@angular/core';

import { AclObjectRole } from '../../interfaces/acl-object-role';
import { AclRole } from '../../interfaces/acl-role';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsFormModule } from '@firestitch/form';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';


@Component({
    selector: 'fs-acl-object-roles',
    templateUrl: './acl-object-roles.component.html',
    styleUrls: ['./acl-object-roles.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    standalone: true,
    imports: [FsCheckboxGroupModule, FormsModule, FsFormModule, MatCheckbox, MatFormField, MatSelect, MatOption]
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

  public changed() {
    this.change.emit(this.aclObjectRoles);
  }
}
