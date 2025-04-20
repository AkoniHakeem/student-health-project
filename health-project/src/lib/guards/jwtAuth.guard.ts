import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from 'src/modules/users/jwt.service';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    canActivate(ctx: ExecutionContext): boolean {
      const req = ctx.switchToHttp().getRequest();
      const auth = req.headers.authorization;
  
      if (!auth) throw new UnauthorizedException('Missing Authorization header');
  
      const [type, token] = auth.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid Authorization header format');
      }
  
      const payload = this.jwtService.verify(token);
      req.user = payload; // attach { sub, role } to request.user
      return true;
    }
  }
  