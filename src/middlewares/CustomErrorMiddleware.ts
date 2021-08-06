import { NextFunction, Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Container, Service } from 'typedi';
import { ErrorType } from '../enums';
import { LogService } from '../services';

const logService: LogService = Container.get(LogService);

@Middleware({ type: 'after' })
@Service()
export class CustomErrorMiddleware implements ExpressErrorMiddlewareInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(error: any, request: Request, response: Response, next: NextFunction): any {
    let errors: Record<string, any>[] = [];
    if ('errors' in error) {
      errors = error.errors;
    }

    if (error.name === ErrorType.BadRequest) {
      logService.warn(error.message, { errors });
      return response.status(400).json({ message: error.message, code: 400, ...{ errors } });
    }

    if (error.name === ErrorType.Validation) {
      return response.status(400).json({ message: error.message, code: 400, ...{ errors } });
    }

    if (error.name === ErrorType.Unauthorized) {
      return response.status(401).json({ message: error.message, code: 401, ...{ errors } });
    }

    if (error.name === ErrorType.Forbidden) {
      return response.status(403).json({ message: error.message, code: 403, ...{ errors } });
    }

    if (error.name === ErrorType.NotFound) {
      return response.status(404).json({ message: error.message, code: 404, ...{ errors } });
    }

    logService.error(error.message, { errors });

    return response.status(500).json({
      message: error.message,
      code: 500,
      ...{ errors },
    });
  }
}
