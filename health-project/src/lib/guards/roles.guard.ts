import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { UserRole } from '../types';
import { ROLES_KEY } from '../decorators/roles.decorators';
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(ctx: ExecutionContext): boolean {
      const required = this.reflector.get<UserRole[]>(ROLES_KEY, ctx.getHandler());
      if (!required) return true;
  
      const { user } = ctx.switchToHttp().getRequest();
      if (!user || !required.includes(user.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    }
  }
  