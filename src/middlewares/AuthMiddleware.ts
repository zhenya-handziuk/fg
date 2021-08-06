import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UnauthorizedError } from 'routing-controllers';
import { Container } from 'typedi';
import { Users } from '../database/entities';
import { LogService } from '../services';

export const AuthMiddleware = () => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const logService: LogService = Container.get(LogService);

  passport.authenticate('bearer', { session: false }, (err: any, user: Users, info: any) => {
    if (!user) {
      return next(new UnauthorizedError('Authentication failed.'));
    }

    if (err) {
      logService.error(
        `passport.authenticate() had some issues, here are details: ${JSON.stringify(info)}`,
      );
      return next(err);
    }

    req.user = user;

    return next();
  })(req, res, next);
};
