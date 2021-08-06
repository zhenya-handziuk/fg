import config from 'config';
import { verify } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import { UnauthorizedError } from 'routing-controllers';
import { Container } from 'typedi';
import { Users } from '../database/entities';
import { UserService } from '../services';

export const PassportStrategy = () => {
  passport.use(
    new Strategy(async (token, done) => {
      const userService: UserService = Container.get(UserService);
      const secret: string = config.get('secret');
      let decode: any;

      try {
        decode = verify(token, secret);
      } catch (err) {
        return done(new UnauthorizedError('Authentication failed.'));
      }

      const user: Users = await userService.getByParam({ id: decode.id });

      if (!user) {
        return done(
          new UnauthorizedError(
            'You are not licensed to view a certain page as a result of invalid verification headers',
          ),
        );
      }

      return done(null, user, { scope: 'all' });
    }),
  );
};
