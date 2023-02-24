import { Document } from 'mongoose';

export interface IUser extends Document {
    readonly email: string;
    readonly password: string;
    readonly username: string;
    readonly admin: boolean;
}
