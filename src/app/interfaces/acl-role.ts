import { AclRoleConfig } from './acl-role-config';

export interface AclRole {
  id?: number;
  name?: string;
  description?: string;
  state?: string;
  reference?: string;
  allPermissions?: boolean;
  role?: string;
  level?: string;
  permissions?: any;
  access?: string;
  protected?: boolean;
  aclPermissions?: any;
  aclRoleConfigs?: AclRoleConfig[];
}
