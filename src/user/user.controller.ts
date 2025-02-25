import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  @Get()
  @UseGuards(JWTAuthGuard)
  getUserProfile(@User() user) {
    return { message: 'User profile data', user };
  }
}
