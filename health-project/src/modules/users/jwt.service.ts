import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;
  private readonly expiresIn = '1h';

  constructor(private config: ConfigService) {
    this.jwtSecret = this.config.get<string>('JWT_SECRET') || 'changeme';
  }

  sign(user: Pick<User, 'id' | 'role'>) {
    const payload = { sub: user.id, role: user.role };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.expiresIn });
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
