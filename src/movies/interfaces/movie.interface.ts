import { Document, Types } from 'mongoose';

export interface IMovie extends Document {
    readonly title: string;
    readonly overview: string;
    readonly releaseDate: string;
    approved: boolean;
    ratings: { rating: number; user: string }[];
    status: { status: string; user: string }[];
}
