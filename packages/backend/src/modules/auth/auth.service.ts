import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role?.name };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(payload: RegisterDto) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const user = await this.usersService.createUser({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      password: hashedPassword,
    });
    return { user: { id: user.id, email: user.email, fullName: user.fullName } };
  }
}
