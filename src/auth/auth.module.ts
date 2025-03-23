import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
@Module({
  imports: [
    // 모듈에서 사용할 다른 모듈들을 가져옵니다.
    UsersModule, // 사용자 관련 기능을 제공하는 UsersModule을 가져옵니다.
    JwtModule.register({
      // JWT 인증을 위한 JwtModule을 설정합니다.
      secret: process.env.JWT_SECRET || 'default_secret', // JWT 서명을 위한 비밀 키를 설정합니다.
      signOptions: { expiresIn: '1d' }, // 토큰의 유효기간을 1일로 설정합니다.
    }),
  ],
  controllers: [AuthController], // 이 모듈에서 사용할 컨트롤러를 지정합니다.
  providers: [AuthService, JwtStrategy], // 이 모듈에서 사용할 서비스와 전략을 지정합니다.
})
export class AuthModule {} // AuthModule 클래스를 정의하고 내보냅니다.
