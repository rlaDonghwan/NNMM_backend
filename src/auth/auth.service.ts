import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common' // NestJS의 Injectable 데코레이터와 ConflictException 예외를 가져옴
import { UsersService } from '../users/users.service' // UsersService를 가져옴 (사용자 관련 로직 처리)
import { SignupDto } from './auth.dto' // 회원가입 요청 데이터를 정의한 DTO를 가져옴
import { LoginDto } from './auth.dto' // 회원가입 요청 데이터를 정의한 DTO를 가져옴
import * as bcrypt from 'bcrypt' // 비밀번호 암호화를 위한 bcrypt 라이브러리를 가져옴
import { JwtService } from '@nestjs/jwt' // JWT 토큰 생성을 위한 JwtService를 가져옴
import e from 'express'
import { UserDocument } from '../users/user.schema'
import { Types } from 'mongoose'

@Injectable() // 이 클래스가 NestJS의 의존성 주입 시스템에서 사용될 수 있도록 Injectable 데코레이터를 추가
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {} // UsersService를 의존성으로 주입받음

  // 회원가입 로직을 처리하는 메서드
  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email) // 이메일로 기존 사용자 조회 (usersService의 findByEmail 메서드 호출)
    if (existing) throw new ConflictException('이미 존재하는 이메일입니다') // 이미 존재하는 이메일이면 ConflictException 예외 발생

    const hashedPassword = await bcrypt.hash(dto.password, 10) // 비밀번호를 bcrypt 라이브러리를 사용해 해싱 (비밀번호 암호화)
    const user = await this.usersService.create({
      // 새로운 사용자 생성 (usersService의 create 메서드 호출)
      ...dto, // DTO의 나머지 필드 복사 (email, name 등)
      password: hashedPassword, // 해싱된 비밀번호로 대체
    })

    return { message: '회원가입 성공', user } // 성공 메시지와 생성된 사용자 객체 반환
  }
  //----------------------------------------------------------------------------------------------------

  // 로그인 로직을 처리하는 메서드
  async login(dto: LoginDto) {
    const user = (await this.usersService.findByEmail(dto.email)) as UserDocument

    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다') // 사용자가 없으면 UnauthorizedException 예외 발생

    const isMatch = await bcrypt.compare(dto.password, user.password) // 입력된 비밀번호와 사용자의 비밀번호 해시 비교
    if (!isMatch) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다') // 비밀번호가 일치하지 않으면 UnauthorizedException 예외 발생

    // const payload = { sub: user._id, email: user.email } // JWT 토큰에 담을 페이로드 데이터 정의
    const payload = {
      sub: (user._id as Types.ObjectId).toString(),
      email: user.email,
    }

    const token = this.jwtService.sign(payload) // JWT 토큰 생성 (JwtService의 sign 메서드 호출)

    return { message: '로그인 성공', token, user: { email: user.email, name: user.name } } // 성공 메시지와 토큰 반환
  }
  //----------------------------------------------------------------------------------------------------
}
