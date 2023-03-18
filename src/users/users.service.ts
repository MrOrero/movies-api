import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
    ) {}

    findOne(email: string) {
        return this.userModel.findOne({ email });
    }

    findById(id: string) {
        return this.userModel.findById(id);
    }

    create(user: Partial<IUser>) {
        const createdUser = this.userModel.create(user);

        return createdUser;
    }
}
