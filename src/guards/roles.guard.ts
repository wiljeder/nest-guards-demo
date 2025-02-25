import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_HIERARCHY } from 'src/constants/role-hierarchy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { roles, strict } = this.reflector.get<{
      roles: string[];
      strict: boolean;
    }>('roles', context.getHandler()) || { roles: [], strict: false };

    if (!roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role is required');
    }

    const userRoles = strict ? [user.role] : ROLE_HIERARCHY[user.role] || [];

    if (!roles.some((role) => userRoles.includes(role))) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
