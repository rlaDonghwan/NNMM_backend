import { Module } from '@nestjs/common'
import { ESGController } from './esg.controller'
import { ESGService } from './esg.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ESG, ESGSchema } from './schemas/esg.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: ESG.name, schema: ESGSchema }])],
  controllers: [ESGController],
  providers: [ESGService],
})
export class ESGModule {}
