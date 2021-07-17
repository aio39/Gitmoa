import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface Payload {
  token: string;
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  githubLogin(req) {
    if (!req.user) {
      return {
        message: 'No User information from github',
        success: false,
      };
    }
    const payload: Payload = { token: req.user.accessToken, id: req.user.id };
    const jwt = this.jwtService.sign(payload);
    return {
      message: 'User information from github',
      user: req.user,
      success: true,
      jwt,
    };
  }
}
