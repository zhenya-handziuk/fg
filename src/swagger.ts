import config from 'config';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { Env } from './enums';

const host: string = config.get('host');
const port: string = config.get('port');
const env: string = config.get('env');
const server: string = env === Env.Local ? `${host}:${port}` : host;

/**!
 * @swagger
 * components:
 *   securitySchemes:
 *     Basic:
 *       type: http
 *       scheme: basic
 *   schemas:
 *     Health:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Indicates whether the service status is acceptable or not.
 *           enum: [pass, fail, warn]
 *           example: pass
 *         version:
 *           type: string
 *           description: A public version of the service.
 *           example: v1
 *         description:
 *           type: string
 *           description: Human-friendly description of the service.
 *           example: Health of service
 *         details:
 *           type: object
 *           description: An object representing status of sub-components of the service
 *     Users:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID.
 *           example: 1
 *         email:
 *           type: string
 *           description: The user email.
 *           example: zhenya@gmail.com
 *         firstName:
 *           type: string
 *           description: The user first name.
 *           example: Zhenya
 *         secondName:
 *           type: string
 *           description: The user second name.
 *           example: Zhenya
 *         middleName:
 *           type: string
 *           description: The user middle name.
 *           example: Zhenya
 *         password:
 *           type: string
 *           description: The user password.
 *           example: 123123
 *     UserRoles:
 *       type: array
 *       items:
 *         type: string
 *     Roles:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identifier.
 *           example: 13
 *         value:
 *           type: string
 *           enum: [Admin, User]
 *           description: Type of user roles.
 *           example: admin
 *         description:
 *           type: string
 *           description: Type.
 *           example: future
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when a banner was created.
 *           example: 2020-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when a banner was updated.
 *           example: 2020-01-01T00:00:00.000Z
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Something went wrong
 *         code:
 *           type: integer
 *           example: 400
 *     Error401:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Unauthorized.
 *         code:
 *           type: integer
 *           example: 401
 *     Error403:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Forbidden.
 *         code:
 *           type: integer
 *           example: 403
 *     Error500:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Internal server error
 *         code:
 *           type: integer
 *           example: 500
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 */
export default swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'FG API',
      version: 'v1',
      description: 'Food Guide API',
    },
    server: [{ url: server }],
    basePath: '/',
    components: {
      securitySchemes: {},
    },
  },
  apis: [path.resolve(__dirname, './swagger.*'), path.resolve(__dirname, './controllers/**.*')],
});
