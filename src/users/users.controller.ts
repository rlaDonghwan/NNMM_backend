import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req) {
    console.log('🛑 users/me 접근 시도') // 여기까지 도달하면 validate 성공
    console.log('req.user:', req.user)
    // return req.user
    const { _id, email, name } = req.user
    return { _id, email, name }
  }
}
