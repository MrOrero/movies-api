import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
    ) {}

    find(email: string) {
        return this.userModel.findOne({ email });
    }

    create(user: Partial<IUser>) {
        const createdUser = this.userModel.create(user);

        return createdUser;
    }
}
