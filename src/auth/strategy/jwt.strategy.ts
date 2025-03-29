// src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { UsersService } from '@/users/users.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken, // ✅ 쿠키에서 accessToken 추출
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    })
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub)
    if (!user) {
      throw new Error('Invalid token payload')
    }
    return user // ✅ req.user로 들어감
  }
}
