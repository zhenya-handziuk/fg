import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Roles, Users } from '../database/entities';
import { Role } from '../enums';
import { BadRequestError, NotFoundError } from '../errors';
import { LogService } from './LogService';
import { RoleService } from './RoleService';

/**
 * UserService class
 */
@Service()
export class UserService {
  /**
   * Instance of log service
   */
  @Inject()
  private logService: LogService;

  /**
   * Instance of role service
   */
  @Inject()
  private roleService: RoleService;

  /**
   * Instance of user repository
   */
  @InjectRepository(Users)
  private readonly userRepository: Repository<Users>;

  /**
   * Method for user registration
   * @param data
   */
  public async registration(data: Users) {
    try {
      const role: Roles = await this.roleService.getRoleByValue(Role.User);
      const entity: any = await this.userRepository.create({ ...data, roles: [role] });

      entity.password = UserService.hashPassword(entity.password);

      const user: Users = await this.userRepository.save(entity);

      this.logService.info('Success create user');
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Login user in system
   * @param data
   */
  public async login(data: any) {
    const user: Users = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundError(`User with this email - ${data.email} not found`);
    }

    await UserService.checkPassword(data.password, user.password);

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 60 * 60 });

    delete user.password;

    return {
      user,
      token,
    };
  }

  public async update(data: any) {
    const user: any = await this.userRepository.findOne(data.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const dataKey: string[] = Object.keys(data).filter((it: string) => it !== 'id');

    dataKey.forEach((key: string) => {
      user[key] = data[key];
    });

    await this.userRepository.save(user);

    return user;
  }

  /**
   * Method for get of all users
   */
  public async getAll() {
    try {
      return await this.userRepository.find({ relations: ['roles'] });
    } catch (err) {
      this.logService.error(`Error for create user ${err}`);
    }
  }

  public async getOne(id: number) {
    const user: Users = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  public async getByParam(params: any) {
    try {
      return this.userRepository.findOne(params);
    } catch (err) {
      this.logService.error(err.message);
    }
  }

  public async existUser(where: Record<string, any>) {
    try {
      return this.userRepository.count({ where });
    } catch (err) {
      this.logService.error(`Error for get user ${err}`);
    }
  }

  /**
   * Method for hash password
   * @param password
   */
  private static hashPassword(password: string): string {
    const saltRounds = 10;
    const salt: string = genSaltSync(saltRounds);

    return hashSync(password, salt);
  }

  private static checkPassword(password: string, userPassword: string) {
    const comparePassword: boolean = compareSync(password, userPassword);

    if (!comparePassword) {
      throw new BadRequestError('Password not confirm');
    }
  }
}
