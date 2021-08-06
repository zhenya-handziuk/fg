import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Roles } from '../database/entities';
import { LogService } from './LogService';

@Service()
export class RoleService {
  @Inject()
  private logService: LogService;

  @InjectRepository(Roles)
  private readonly roleRepository: Repository<Roles>;

  /**
   * Create a new role
   * @param data
   */
  public async create(data: Roles) {
    try {
      const existRole = await this.getRoleByValue(data.value);

      if (existRole) {
        return existRole;
      }

      const entity: any = await this.roleRepository.create(data);
      const role: Roles = await this.roleRepository.save(entity);

      return role;
    } catch (err) {
      this.logService.error('Error for create role' + err);
    }
  }

  /**
   * Get role by value
   * @param value
   */
  public async getRoleByValue(value: string) {
    try {
      const role: Roles = await this.roleRepository.findOne({
        where: { value },
      });

      return role;
    } catch (err) {
      this.logService.error('Error for get role by value' + err);
    }
  }
}
