// src/users/users.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './user.schema'

@Injectable() // 이 클래스가 NestJS의 의존성 주입 시스템에서 제공자로 사용될 수 있도록 표시
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>, // Mongoose 모델을 의존성으로 주입
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    // 이메일로 사용자를 검색하는 메서드
    return this.userModel.findOne({ email }).exec() // MongoDB에서 이메일로 사용자 검색
  }

  async create(data: Partial<User>): Promise<User> {
    // 새로운 사용자를 생성하는 메서드
    const user = new this.userModel(data) // Mongoose 모델 인스턴스 생성
    return user.save() // MongoDB에 사용자 저장
  }
}
