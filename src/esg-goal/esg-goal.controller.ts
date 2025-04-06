import { JwtAuthGuard } from '@/auth/jwt/jwt.guard'
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { CreateEsgGoalDto } from './CreateOrUpdateGoalDto'
import { EsgGoalService } from './esg-goal.service'

@UseGuards(JwtAuthGuard)
@Controller('esg-goal')
export class EsgGoalController {
  constructor(private readonly esgGoalService: EsgGoalService) {}

  @Post()
  createGoal(@Body() dto: CreateEsgGoalDto, @Req() req) {
    return this.esgGoalService.createGoal({ ...dto, userId: req.user.id })
  }
  //----------------------------------------------------------------------------------------------------

  // category + year 기준으로 목표값 조회
  @Get(':category')
  getGoalsByCategory(@Param('category') category: string, @Query('year') year: string, @Req() req) {
    return this.esgGoalService.getGoalsByCategory(req.user.id, category, Number(year))
  }
  //----------------------------------------------------------------------------------------------------

  // category + indicatorKey + year 기준으로 삭제
  @Delete(':indicatorKey/:category')
  removeGoal(
    @Param('indicatorKey') indicatorKey: string,
    @Param('category') category: string,
    @Query('year') year: string,
    @Req() req,
  ) {
    return this.esgGoalService.deleteGoal(req.user.id, indicatorKey, category, Number(year))
  }
  //----------------------------------------------------------------------------------------------------
}
