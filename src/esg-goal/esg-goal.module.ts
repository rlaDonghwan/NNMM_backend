import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EsgGoal, EsgGoalSchema } from './esg-goal.schema'
import { EsgGoalService } from './esg-goal.service'
import { EsgGoalController } from './esg-goal.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: EsgGoal.name, schema: EsgGoalSchema }])],
  controllers: [EsgGoalController],
  providers: [EsgGoalService],
})
export class EsgGoalModule {}
