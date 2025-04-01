import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { SignupDto } from '@/auth/auth.dto'
import { LoginDto } from '@/auth/auth.dto'
import { JwtService } from '@nestjs/jwt'

@Controller('auth') // 'auth' 경로로 들어오는 요청을 처리하는 컨트롤러로 지정
export class AuthController {
  // AuthService를 의존성 주입받아 사용
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, // JwtService를 의존성 주입받아 사용
  ) {}

  // 'POST /auth/signup' 경로로 들어오는 요청을 처리
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    // 요청의 body 데이터를 SignupDto로 매핑
    return this.authService.signup(dto) // AuthService의 signup 메서드 호출 후 결과 반환
  }
  //----------------------------------------------------------------------------------------------------

  // 'POST /auth/login' 경로로 들어오는 요청을 처리
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto) // AuthService의 login 메서드 호출 후 결과 반환
  }
  //----------------------------------------------------------------------------------------------------

  @Get('text-token')
  getTestToken(): { accessToken: string } {
    const payload = {
      sub: '67e245761c6463a49d5ac899', // ✅ 너의 유저 ID
      email: 'kdhe@naver.com',
      name: '김동환',
      companyName: '삼성전자',
      role: 'user',
    }

    const accessToken = this.jwtService.sign(payload)
    return { accessToken }
  }

  //----------------------------------------------------------------------------------------------------
}
