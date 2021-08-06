import { Container } from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import { LogService } from '../services';

const logService: LogService = Container.get(LogService);

export const TypeORMConfiguration = (): any => {
  useContainer(Container);
  createConnection()
    .then(() => {
      logService.info('typeorm createConnection: The connection was successfully established.');
    })
    .catch((err) => {
      logService.error(`typeorm createConnection: ${err.message}`);
    });
};
