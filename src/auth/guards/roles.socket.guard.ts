import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesSocketGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const result = context.switchToWs().getClient();
    let token = result.handshake.headers['authorization'];
    if (!token) {
      return false;
    }
    token = token.split(' ')[1];

    const user = await this.authService.getUserFromAuthenticationToken(token);
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] === user.roles) {
        return true;
      }
    }
    return false;
  }
}
