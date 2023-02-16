import { Injectable, InternalServerErrorException } from '@nestjs/common';
const request = require('request-promise');

@Injectable()
export class MoviesService {
  async getTopMovies() {
    let page = 1;
    let counter = 1;
    let newData = [];
    let totalData = [];
    try {
      while (page <= 5) {
        const response = await request({
          url: `https://api.themoviedb.org/3/movie/top_rated?api_key=88d941ebe821b006be5216b931a8ba44&language=en-US&page=${page}`,
          json: true,
        });
        newData = response.results.map((movie) => {
          return {
            id: counter++,
            title: movie.title,
            overview: movie.overview,
          };
        });

        page++;

        totalData = [...totalData, ...newData];
      }
      return totalData;
    } catch (error) {
      throw new InternalServerErrorException({
        cause: new Error(error),
      });
    }
  }
}
