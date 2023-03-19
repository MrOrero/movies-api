// const request = require('request-promise');
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IMovie } from './interfaces/movie.interface';
import Mongoose from 'mongoose';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel('Movie') private readonly movieModel: Model<IMovie>,
    ) {}

    async getTopMovies() {
        const moviesCount = await this.movieModel.find().countDocuments();
        const result = await this.movieModel.aggregate([
            { $match: { approved: true } },
            { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    approved: { $first: '$approved' },
                    overview: { $first: '$overview' },
                    releaseDate: { $first: '$releaseDate' },
                    averageRating: { $avg: '$ratings.rating' },
                },
            },
            {
                $project: {
                    _id: 0,
                    movieId: '$_id',
                    title: 1,
                    approved: 1,
                    overview: 1,
                    releaseDate: 1,
                    averageRating: { $ifNull: ['$averageRating', 0] },
                },
            },
        ]);

        return { total: moviesCount, result };
    }

    async rateMovie(movieId: string, rating: number, userId: string) {
        let updatedRatings: IMovie['ratings'];
        const movie = await this.movieModel.findById(movieId);

        if (!movie) {
            throw new NotFoundException('Movie not found');
        }

        updatedRatings = movie.ratings.map((existingRating) => {
            if (existingRating.user.toString() === userId) {
                // @ts-ignore
                return { ...existingRating._doc, rating };
            }
            return existingRating;
        });

        console.log('updatedRatings', updatedRatings);

        // const existingUserRating = updatedRatings.find(
        //     (rating) => rating && rating.user.toString() === userId,
        // );

        const existingUserRating = updatedRatings.find(
            (rating) => rating?.user.toString() === userId,
        );

        if (!existingUserRating) {
            updatedRatings.push({ user: userId, rating });
        }

        movie.ratings = updatedRatings;

        return movie.save();
    }

    async getMovie(movieId: string) {
        const movie = await this.movieModel.aggregate([
            {
                $match: {
                    _id: new Mongoose.Types.ObjectId(movieId),
                },
            },
            { $unwind: '$ratings' },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    approved: { $first: '$approved' },
                    overview: { $first: '$overview' },
                    releaseDate: { $first: '$releaseDate' },
                    averageRating: { $avg: '$ratings.rating' },
                },
            },
        ]);

        if (!movie.length) {
            const movie2 = await this.movieModel.find({
                _id: movieId,
            });
            if (!movie2.length) {
                throw new NotFoundException('Movie not found');
            }
            return movie2;
        }

        return movie;
    }

    async addMovie(movie: Partial<IMovie>, userId: string) {
        // const movies = await this.movieModel.find({
        //     title: { $regex: movie, $options: 'i' },
        // });

        const movies = await this.movieModel.find({
            title: movie.title,
        });

        if (movies.length) {
            throw new ConflictException('Movie already exists');
        }

        const newMovie = new this.movieModel({
            ...movie,
            ratings: [{ user: userId, rating: 0 }],
        });
        return newMovie.save();
    }

    async approveMovie(movieId: string, approved: boolean) {
        const movie = await this.movieModel.findById(movieId);
        movie.approved = approved;
        return movie.save();
    }

    async getTopMoviesForUser(userId: string) {
        const moviesCount = await this.movieModel.find().countDocuments();
        const result = await this.movieModel.aggregate([
            { $match: { approved: true } },
            { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    approved: { $first: '$approved' },
                    overview: { $first: '$overview' },
                    releaseDate: { $first: '$releaseDate' },
                    averageRating: { $avg: '$ratings.rating' },
                    userRating: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$ratings.user',
                                        new Mongoose.Types.ObjectId(userId),
                                    ],
                                },
                                '$ratings.rating',
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    movieId: '$_id',
                    title: 1,
                    approved: 1,
                    overview: 1,
                    releaseDate: 1,
                    averageRating: { $ifNull: ['$averageRating', 0] },
                    userRating: { $ifNull: ['$userRating', 0] },
                },
            },
        ]);

        return { total: moviesCount, result };
    }

    async getMovieForUser(movieId: string, userId: string) {
        const movie = await this.movieModel.aggregate([
            {
                $match: {
                    _id: new Mongoose.Types.ObjectId(movieId),
                    approved: true,
                },
            },
            { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    approved: { $first: '$approved' },
                    overview: { $first: '$overview' },
                    releaseDate: { $first: '$releaseDate' },
                    averageRating: { $avg: '$ratings.rating' },
                    userRating: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$ratings.user',
                                        new Mongoose.Types.ObjectId(userId),
                                    ],
                                },
                                '$ratings.rating',
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    movieId: '$_id',
                    title: 1,
                    approved: 1,
                    overview: 1,
                    releaseDate: 1,
                    averageRating: { $ifNull: ['$averageRating', 0] },
                    userRating: { $ifNull: ['$userRating', 0] },
                },
            },
        ]);

        if (!movie.length) {
            throw new NotFoundException('Movie not found');
        }

        return movie;
    }

    // async indexMoviesInDb() {
    //     let page = 1;
    //     let newData = [];
    //     let totalData = [];
    //     try {
    //         while (page <= 5) {
    //             const response = await request({
    //                 url: `https://api.themoviedb.org/3/movie/top_rated?api_key=88d941ebe821b006be5216b931a8ba44&language=en-US&page=${page}`,
    //                 json: true,
    //             });
    //             newData = response.results.map((movie) => {
    //                 return {
    //                     title: movie.title,
    //                     overview: movie.overview,
    //                     releaseDate: movie.release_date,
    //                     ratings: {
    //                         rating: 0,
    //                     },
    //                     approved: true,
    //                 };
    //             });

    //             page++;
    //             totalData = [...totalData, ...newData];
    //         }

    //         const movies = await this.movieModel.insertMany(totalData);
    //         return movies;
    //     } catch (error) {
    //         console.log(error);
    //         const errorMessage =
    //             typeof error === 'string' ? error : JSON.stringify(error);
    //         throw new InternalServerErrorException(errorMessage);
    //     }
    // }
}
