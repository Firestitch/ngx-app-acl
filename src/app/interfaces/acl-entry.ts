import { AclRole } from './acl-role';


export interface AclEntry {
  id: number;
  aclRoleId?: number;
  aclRole?: AclRole;
  accountId?: number;
  account?: any;
  objectId?: number;
  object?: { name: string, id: number };
  environmentId?: number;
  environment?: { name: string, id: number };
}
