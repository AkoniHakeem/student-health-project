import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../../lib/types';
import { JwtService } from './jwt.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { Roles } from 'src/lib/decorators/roles.decorators';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { id: user.id };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    const accessToken = this.jwtService.sign({ id: user.id, role: user.role });
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.usersService.findAll({ page, limit });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
