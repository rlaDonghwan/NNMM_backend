// src/users/users.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/users/schemas/user.schema'
import { UsersService } from '@/users/users.service'
import { UsersController } from '@/users/users.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
