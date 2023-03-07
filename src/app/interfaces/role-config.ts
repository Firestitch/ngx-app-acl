export interface RoleConfig {
  name?: string;
  description?: string;
  type?: 'checkbox' | 'select';
  values?: { name: string; value: string}[];
  required?: boolean;
  level?: string;
  label?: string;
}
