import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupDto } from '../auth/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }
}
