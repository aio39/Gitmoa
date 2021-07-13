import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './github-atuh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(GithubAuthGuard)
  @Redirect('http://localhost:3000/')
  githubAuthRedirect(@Req() req) {
    console.log('githutAuthRedirect');
    console.log(req.user);
    if (!this.authService.githubLogin(req)) {
      return { url: 'http://localhost:3000/fail' };
    } else {
      return {
        url: `http://localhost:3000?${this.authService.githubLogin(req).jwt}`,
      };
    }
  }
}
