import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@lib/entity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['email', 'profile', 'read:status', 'repo'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done,
  ): Promise<any> {
    const { id, displayName, username, profileUrl }: User = profile;
    const email = profile.emails[0]?.value;
    const photos = profile.photos[0]?.value;
    try {
      const exists = await this.users.findOne({ id });
      const updateData = [
        id,
        displayName,
        username,
        profileUrl,
        email,
        photos,
        accessToken,
      ];
      if (!exists) {
        this.users.save({
          ...updateData,
        });
      } else {
        exists.accessToken = accessToken;
        this.users.save(exists);
      }
    } catch (error) {
      console.log(error);
      return done(error);
    }

    const user = {
      id,
      username,
      accessToken,
    };
    done(null, user);
  }
}
