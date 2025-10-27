import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'aclRolePermissionAvailable',
    standalone: true
})
export class AclRolePermissionAvailablePipe implements PipeTransform {

  public transform(permission, aclRolePermissions): boolean {
    if(permission.requires && permission.requires.length) {
      
      const exists = permission.requires
        .every((item) => aclRolePermissions[item]);

      return exists;
    }
    
    return true;
  }
}
