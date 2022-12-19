import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());

    if (!roles) {
      return true;
    }
    const req = ctx.switchToHttp().getRequest();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] === req.user.roles) {
        return true;
      }
    }
    return false;
  }
}
