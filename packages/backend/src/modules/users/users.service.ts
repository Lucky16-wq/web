import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async createUser(data: Partial<User>) {
    let defaultRole = await this.roleRepository.findOne({ where: { name: 'Customer' } });
    if (!defaultRole) {
      defaultRole = this.roleRepository.create({ name: 'Customer', description: 'End customer role' });
      await this.roleRepository.save(defaultRole);
    }

    const user = this.userRepository.create({ ...data, role: defaultRole });
    return this.userRepository.save(user);
  }
}
