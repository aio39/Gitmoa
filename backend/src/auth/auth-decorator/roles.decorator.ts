import { SetMetadata } from '@nestjs/common';
export enum AllowedRoles {
  Login = 'login',
  Creator = 'creator',
  NotCreator = 'notCreator',
  Admin = 'admin',
}
export const ROLES_KEY = 'roles';
export const Roles = (roles: AllowedRoles[]) => SetMetadata(ROLES_KEY, roles);
