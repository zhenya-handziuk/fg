import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Request, Response } from 'express';
import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Users } from '../database/entities';
import { BadRequestError } from '../errors';
import { AuthMiddleware } from '../middlewares';
import { LogService, UserService } from '../services';

class LoginBody {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

class UpdateBody {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  secondName: string;

  @IsOptional()
  middleName: string;

  @IsOptional()
  @MinLength(6)
  oldPassword: string;

  @IsOptional()
  @MinLength(6)
  newPassword: string;
}

interface UserLogin {
  user: Users;
  token: string;
}

/**
 * UserController class
 */
@JsonController('/api/v1/users')
@Service()
export class UsersController {
  /**
   * Instance of user service
   */
  @Inject()
  private readonly userService: UserService;

  /**
   * Instance of log service
   */
  @Inject()
  private readonly logService: LogService;

  @Get('/test')
  async test(@Res() res: Response) {
    return res.json({ status: 'success' });
  }

  /**
   * Method for get list of all users
   * @param res
   */
  @UseBefore(AuthMiddleware())
  @Get()
  async list(@Res() res: Response) {
    const users: Users[] = await this.userService.getAll();

    this.logService.info('Success get list of users');
    return res.json({ users });
  }

  /**
   * Method get a single user by id
   * @param id {number}
   * @param res
   */
  @UseBefore(AuthMiddleware())
  @Get('/:id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const user: Users = await this.userService.getOne(id);

    return res.json({ data: user });
  }

  /**
   * Method for user registration
   * @param body
   * @param res
   */
  @Post('/registration')
  async registration(@Body() body: Users, @Res() res: Response) {
    const existUser = await this.userService.existUser({ email: body.email });

    if (existUser) {
      throw new BadRequestError('User already exist');
    }

    const user = await this.userService.registration(body as Users);
    return res.json({ user });
  }

  @Post('/login')
  async login(@Body() body: LoginBody, @Res() res: Response) {
    this.logService.info('Start login user');
    const login: UserLogin = await this.userService.login(body as Users);

    this.logService.info('Success login user', { userId: login.user.id });
    return res.json(login);
  }

  @UseBefore(AuthMiddleware())
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateBody,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (isNaN(id)) {
      throw new BadRequestError('Id must be a number');
    }
    const updatedUser = await this.userService.update(body);

    return res.json({ data: updatedUser });
  }
}
