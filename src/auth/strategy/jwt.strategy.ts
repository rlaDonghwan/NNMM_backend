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
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          console.log('👉 쿠키 accessToken:', req?.cookies?.accessToken)
          return req?.cookies?.accessToken
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    })
  }

  async validate(payload: any) {
    console.log('👉 JWT payload:', payload)
    const user = await this.usersService.findById(payload.sub)
    console.log('👉 JWT user:', user)
    if (!user) {
      throw new Error('Invalid token payload')
    }
    return user // ✅ req.user로 들어감
  }
}
