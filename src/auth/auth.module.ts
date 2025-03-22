import { Module } from '@nestjs/common' // NestJS의 Module 데코레이터를 가져옵니다.
import { AuthService } from './auth.service' // AuthService를 가져옵니다.
import { AuthController } from './auth.controller' // AuthController를 가져옵니다.
import { UsersModule } from '../users/users.module' // UsersModule을 가져옵니다.

@Module({
  imports: [UsersModule], // UsersModule을 현재 모듈에 가져옵니다.
  controllers: [AuthController], // AuthController를 현재 모듈의 컨트롤러로 등록합니다.
  providers: [AuthService], // AuthService를 현재 모듈의 프로바이더로 등록합니다.
})
export class AuthModule {} // AuthModule 클래스를 정의하고 @Module 데코레이터로 모듈로 선언합니다.
