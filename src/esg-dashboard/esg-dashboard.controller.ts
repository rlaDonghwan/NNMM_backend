import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { EsgDashboardService } from './esg-dashboard.service'
import { CreateEsgDashboardDto } from './esg-dashboard.dto'
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard'
import { Request } from 'express'

@Controller('esg-dashboard')
@UseGuards(JwtAuthGuard)
export class EsgDashboardController {
  constructor(private readonly esgDashboardService: EsgDashboardService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateEsgDashboardDto) {
    console.log('🍪 req.headers.cookie:', req.headers.cookie)
    console.log('🍪 req.cookies:', req.cookies)
    const user = req.user as { _id: string }
    return this.esgDashboardService.create(user._id, dto)
  }

  @Get()
  async getAllByUser(@Req() req: Request) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.findByUser(user._id)
  }

  @Get('by-category')
  async getByCategory(@Req() req: Request, @Query('category') category: string) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.findByUserAndCategory(user._id, category)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.esgDashboardService.deleteById(id)
  }
}
