import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY || 'FAKE_SECRET',
    });
  }

  public async validate(payload: { email: string; id: string }) {
    const user = await this.authService.validateJwtUser(
      payload.email,
      payload.id,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
