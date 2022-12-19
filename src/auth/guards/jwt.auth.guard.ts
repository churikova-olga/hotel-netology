import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid JWT');
    }
    return super.handleRequest(err, user, info, context, status);
  }
}

@Injectable()
export class AllowNullUserGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // Если пользователь на авторизован, то user = null
    return user || null;
  }
}

@Injectable()
export class GatewaySocketGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // regular `Socket` from socket.io is probably sufficient
    const socket = context.switchToWs().getClient();
    const token = socket.handshake.headers['authorization'];
    return !!token;
  }
}
