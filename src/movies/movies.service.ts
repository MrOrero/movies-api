const request = require('request-promise');
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IMovie } from './interfaces/movie.interface';

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel('Movie') private readonly movieModel: Model<IMovie>,
    ) {}

    async getTopMovies() {
        try {
            const moviesCount = await this.movieModel.find().countDocuments();
            const result = await this.movieModel.aggregate([
                { $match: { approved: true } },
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

            return { total: moviesCount, result };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    // async getTopMovies() {
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
