import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done,
  ): Promise<any> {
    console.log('validate');
    // TODO db와 연동.
    console.log(profile);
    console.log('profile end');
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      // firstName: name.givenName,
      // lastName: name.familyName,
      // picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}

// passport.use(new GitHubStrategy({
//   clientID: GITHUB_CLIENT_ID,
//   clientSecret: GITHUB_CLIENT_SECRET,
//   callbackURL: "http://127.0.0.1:3000/auth/github/callback"
// },
// function(accessToken, refreshToken, profile, done) {
//   User.findOrCreate({ githubId: profile.id }, function (err, user) {
//     return done(err, user);
//   });
// }
// ));

// app.get('/auth/github',
//   passport.authenticate('github', { scope: [ 'user:email' ] }));

// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });
