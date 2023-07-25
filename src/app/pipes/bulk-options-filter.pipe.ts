import { Pipe, PipeTransform } from '@angular/core';

import { AclRoleAccess } from '../enums/acl-role-access';
import { AclPermission } from '../interfaces/acl-permission';


@Pipe({
  name: 'builkOptionsFilter'
})
export class BulkOptionsFilterPipe implements PipeTransform {

  public transform(rolesList: { name: string, value: AclRoleAccess }[], children: AclPermission[]): any {
    const accessLevels = this._uniqListOfAccessLevels(children);

    return rolesList.filter((permission) => {
      return permission.value === 0 || accessLevels.has(permission.value);
    });
  }

  private _uniqListOfAccessLevels(children: AclPermission[]): Set<number> {
    return children.reduce((acc, value: AclPermission) => {
      value.accesses.forEach((access) => {
        acc.add(access);
      })

      return acc;
    }, (new Set) as Set<number>);
  }
}
