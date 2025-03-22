import { Injectable, ConflictException } from '@nestjs/common' // NestJS의 Injectable 데코레이터와 ConflictException 예외를 가져옴
import { UsersService } from '../users/users.service' // UsersService를 가져옴 (사용자 관련 로직 처리)
import { SignupDto } from './auth.dto' // 회원가입 요청 데이터를 정의한 DTO를 가져옴
import * as bcrypt from 'bcrypt' // 비밀번호 암호화를 위한 bcrypt 라이브러리를 가져옴

@Injectable() // 이 클래스가 NestJS의 의존성 주입 시스템에서 사용될 수 있도록 Injectable 데코레이터를 추가
export class AuthService {
  constructor(private readonly usersService: UsersService) {} // UsersService를 의존성으로 주입받음

  async signup(dto: SignupDto) {
    // 회원가입 로직을 처리하는 메서드
    const existing = await this.usersService.findByEmail(dto.email) // 이메일로 기존 사용자 조회
    if (existing) throw new ConflictException('이미 존재하는 이메일입니다') // 이미 존재하는 이메일이면 예외 발생

    const hashedPassword = await bcrypt.hash(dto.password, 10) // 비밀번호를 bcrypt를 사용해 해싱
    const user = await this.usersService.create({
      // 새로운 사용자 생성
      ...dto, // DTO의 나머지 필드 복사
      password: hashedPassword, // 해싱된 비밀번호로 대체
    })

    return { message: '회원가입 성공', user } // 성공 메시지와 생성된 사용자 반환
  }
}
