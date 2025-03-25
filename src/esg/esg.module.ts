import { Module } from '@nestjs/common'
import { EsgController } from './esg.controller'
import { EsgService } from './esg.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ESG, ESGSchema } from './schemas/esg.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: ESG.name, schema: ESGSchema }])],
  controllers: [EsgController],
  providers: [EsgService],
})
export class ESGModule {}
