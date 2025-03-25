import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema.ts'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  // 이메일로 사용자를 검색
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }
  //----------------------------------------------------------------------------------------------------

  async findByName(name: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        name,
      })
      .exec()
  }
  // ID로 사용자를 검색 (JwtStrategy에서 필요)
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(new Types.ObjectId(id)).exec()
  }
  //----------------------------------------------------------------------------------------------------

  // 새로운 사용자 생성
  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data)
    return user.save()
  }
  //----------------------------------------------------------------------------------------------------
}
