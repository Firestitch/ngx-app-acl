import { AclObjectEntry } from './acl-object-entry';
import { Observable } from 'rxjs';
import { AclRole } from './acl-role';


export interface AclEntryData {
  aclObjectEntry: AclObjectEntry
  titleEdit?: string
  titleAdd?: string
  required?: boolean
  saveAclObjectEntry(aclObjectEntry: AclObjectEntry): Observable<any>
  loadAclRoles (query: any): Observable<AclRole[]>
}

