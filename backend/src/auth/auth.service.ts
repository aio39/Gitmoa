import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  githubLogin(req) {
    if (!req.user) {
      return {
        message: 'No User information from google',
        success: false,
      };
    }

    const payload = { token: req.user.accessToken };
    console.log(payload);
    const jwt = this.jwtService.sign(payload);
    return {
      message: 'User information from google',
      user: req.user,
      success: true,
      jwt,
    };
  }
}
