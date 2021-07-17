import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@lib/entity';

interface JWTPayload {
  id: User['id'];
  username: User['username'];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: JWTPayload) {
    // req에 user 객체 inject
    return { id: payload.id, username: payload.username };
  }
}
