import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { SignupDto } from '@/auth/auth.dto'

@Controller('auth') // 'auth' 경로로 들어오는 요청을 처리하는 컨트롤러로 지정
export class AuthController {
  constructor(private readonly authService: AuthService) {} // AuthService를 의존성 주입받아 사용

  @Post('signup') // 'POST /auth/signup' 경로로 들어오는 요청을 처리
  async signup(@Body() dto: SignupDto) {
    // 요청의 body 데이터를 SignupDto로 매핑
    return this.authService.signup(dto) // AuthService의 signup 메서드 호출 후 결과 반환
  }
}
