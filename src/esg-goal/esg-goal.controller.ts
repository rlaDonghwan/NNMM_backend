import { JwtAuthGuard } from '@/auth/jwt/jwt.guard'
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
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

  @Get(':category')
  getGoalsByCategory(@Param('category') category: string, @Req() req) {
    return this.esgGoalService.getGoalsByCategory(req.user.id, category)
  }
  //----------------------------------------------------------------------------------------------------

  @Delete(':indicatorKey/:category')
  removeGoal(
    @Param('indicatorKey') indicatorKey: string,
    @Param('category') category: string,
    @Req() req,
  ) {
    return this.esgGoalService.deleteGoal(req.user.id, indicatorKey, category)
  }
  //----------------------------------------------------------------------------------------------------
}
