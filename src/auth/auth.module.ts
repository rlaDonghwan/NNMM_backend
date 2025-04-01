import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '@/auth/jwt/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from './jwt/jwt.guard'

@Module({
  imports: [
    UsersModule, // UsersModule을 가져와 사용자 관련 기능을 사용
    PassportModule.register({ defaultStrategy: 'jwt' }), // PassportModule을 'jwt' 기본 전략으로 등록
    JwtModule.registerAsync({
      // JwtModule을 비동기로 설정
      imports: [ConfigModule], // 환경 변수를 접근하기 위해 ConfigModule 가져오기
      inject: [ConfigService], // ConfigService를 주입하여 설정 값 가져오기
      useFactory: (config: ConfigService) => ({
        // JwtModule을 설정하는 팩토리 함수
        secret: config.get('JWT_SECRET'), // 환경 변수에서 JWT 비밀 키 설정
        signOptions: { expiresIn: '1d' }, // 토큰 만료 시간을 1일로 설정
      }),
    }),
  ],
  controllers: [AuthController], // 이 모듈의 컨트롤러로 AuthController 정의
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // AuthService와 JwtStrategy를 의존성 주입을 위해 제공
  exports: [JwtModule, AuthService, JwtAuthGuard], // 다른 모듈에서 사용하기 위해 JwtModule과 AuthService를 내보냄
})
export class AuthModule {} // AuthModule 클래스를 정의하고 내보냄
