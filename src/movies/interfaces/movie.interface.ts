import { Document } from 'mongoose';

export interface IMovie extends Document {
    readonly title: string;
    readonly overview: string;
    readonly releaseDate: string;
    readonly ratings: number;
}
