// src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { UsersService } from '@/users/users.service'
import { ConfigService } from '@nestjs/config'

@Injectable() // 이 클래스가 NestJS의 의존성 주입 시스템에서 제공자로 사용될 수 있도록 표시
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Passport의 JWT 전략을 확장하여 커스텀 전략 정의
  constructor(
    private readonly configService: ConfigService, // 환경 변수 및 설정 값을 가져오기 위한 ConfigService 주입
    private readonly usersService: UsersService, // 사용자 관련 로직 처리를 위한 UsersService 주입
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // JWT를 요청에서 추출하는 방법 정의
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 Bearer 토큰 방식으로 JWT 추출
        (req: Request) => {
          // 요청 객체에서 쿠키를 통해 JWT 추출
          console.log('👉 쿠키 accessToken:', req?.cookies?.accessToken) // 쿠키에 저장된 accessToken 로그 출력
          return req?.cookies?.accessToken // 쿠키에서 accessToken 반환
        },
      ]),
      ignoreExpiration: false, // JWT의 만료 여부를 확인하도록 설정
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret', // JWT 서명 검증을 위한 비밀 키 설정
    })
  }
  //----------------------------------------------------------------------------------------------------

  async validate(payload: any) {
    // JWT의 payload를 검증하는 메서드
    console.log('👉 JWT payload:', payload) // JWT payload 로그 출력
    const user = await this.usersService.findById(payload.sub) // payload의 sub 필드로 사용자 조회
    console.log('👉 JWT user:', user) // 조회된 사용자 정보 로그 출력
    if (!user) {
      // 사용자가 없으면 예외 발생
      throw new Error('Invalid token payload') // 유효하지 않은 토큰 payload 예외
    }
    return user // 검증된 사용자 반환
  }
  //----------------------------------------------------------------------------------------------------
}
