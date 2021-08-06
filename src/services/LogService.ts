import * as log4js from 'log4js';
import { Container, Service, Token } from 'typedi';

const Log4jsLogger = new Token('Log4jsLogger');
Container.set({
  id: Log4jsLogger,
  factory: () => {
    log4js.configure({
      appenders: {
        console: { type: 'stdout' },
      },
      categories: {
        default: {
          appenders: ['console'],
          level: 'all',
        },
      },
    });

    return log4js.getLogger();
  },
});

/**
 * LogService class
 */
@Service()
export class LogService {
  /**
   * Instance of log4js
   */
  private readonly logger: log4js.Logger;

  public constructor() {
    this.logger = Container.get(Log4jsLogger) as log4js.Logger;
  }

  public info(message: string, fields: Record<string, any> = {}) {
    this.logger.info(message, fields);
  }

  public error(message: string, fields: Record<string, any> = {}) {
    this.logger.error(message, fields);
  }

  public warn(message: string, fields: Record<string, any> = {}) {
    this.logger.warn(message, fields);
  }
}
