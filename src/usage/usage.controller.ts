import { Controller, Get, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { RateLimitGuard } from 'src/guards/rate-limit.guard';

@Controller('usage')
export class UsageController {
  @Get()
  @UseGuards(JWTAuthGuard, RateLimitGuard)
  checkUsage() {
    return { message: 'API usage information' };
  }
}
