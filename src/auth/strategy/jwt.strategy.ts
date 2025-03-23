// src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('🔥 JwtStrategy Constructor 호출됨') // ← 반드시 찍혀야 함
    const jwtSecret = process.env.JWT_SECRET || 'default-secret'

    // ✅ 로그 찍기
    console.log('🔐 JWT_SECRET loaded:', jwtSecret)

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    })
    console.log('🧪 JwtStrategy super() 완료됨')
  }

  async validate(payload: any) {
    console.log('🔥 validate() called! payload:', payload) // << 꼭 찍혀야 함
    return { userId: payload.sub, email: payload.email }
  }
}
