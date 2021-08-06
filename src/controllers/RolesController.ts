import { Response } from 'express';
import { Body, Controller, Post, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Roles } from '../database/entities';
import { Role } from '../enums';
import { BadRequestError } from '../errors';
import { RoleService } from '../services/RoleService';

/**
 * RoleController class
 */
@Controller('/api/v1/roles')
@Service()
export class RolesController {
  /**
   * Instance of role service
   */
  @Inject()
  private readonly roleService: RoleService;

  /**
   * Instance of role
   */
  private readonly roles = Role;

  @Post()
  async list(@Body() body: Record<string, any>, @Res() res: Response) {
    if (!Object.values(this.roles).includes(body.value)) {
      throw new BadRequestError('Wrong role');
    }

    const newRole: Roles = await this.roleService.create(body as Roles);

    return res.json(newRole);
  }
}
