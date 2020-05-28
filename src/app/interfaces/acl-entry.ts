import { AclRole } from './acl-role';


export interface AclEntry {
  id: number;
  aclRoleId?: number;
  aclRole?: AclRole;
  accountId?: number;
  account?: Account;
  objectId?: number;
  object?: Object;
  environmentId?: number;
}
