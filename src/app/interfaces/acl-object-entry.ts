import { AclObject } from './acl-object';
import { AclEntry } from './acl-entry';

export interface AclObjectEntry {
  object: AclObject,
  aclEntries: AclEntry[],
  level: string
}
