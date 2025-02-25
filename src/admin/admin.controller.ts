import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ConfigService } from '@nestjs/config';

@Controller('admin')
export class AdminController {
  constructor(private readonly configService: ConfigService) {}

  @Get('dashboard')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(['manager']) // Role hierarchy applies (admin can also access)
  getManagerDashboard() {
    return { message: 'Manager dashboard' };
  }

  @Get('settings')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(['manager'], true) // Strict role match (only manager allowed)
  getStrictManagerSettings() {
    return { message: 'Manager-only settings' };
  }
}
