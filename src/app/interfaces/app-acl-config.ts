import { Observable } from 'rxjs';

import { AclLevel } from './acl-level';


export interface AppAclConfig {
  permissions: Observable<any[]>;
  levels: Observable<AclLevel[]>;
  case: 'snake' | 'camel';
}
