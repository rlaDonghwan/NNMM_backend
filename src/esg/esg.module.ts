import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ESGController } from './esg.controller'
import { ESGService } from './esg.service'
import { ESG, ESGSchema } from './schemas/esg.schema'
import { IndicatorModule } from '@/indicator/indicator.module'
import { User, UserSchema } from '@/users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ESG.name, schema: ESGSchema },
      { name: User.name, schema: UserSchema },
    ]),
    IndicatorModule,
  ],
  controllers: [ESGController],
  providers: [ESGService],
})
export class ESGModule {}
