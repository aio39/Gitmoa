import { Res } from '@nestjs/common';
import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './githubOauth/github-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Req() req) {
    return null;
  }

  // @Redirect('http://localhost:3000/')
  @Get('redirect')
  @UseGuards(GithubAuthGuard)
  githubAuthRedirect(@Req() req) {
    return this.authService.githubLogin(req);
  }

  @Get('jwt')
  @UseGuards(JwtAuthGuard)
  jwtTest(@Req() req) {
    return { user: req.user };
  }
}
