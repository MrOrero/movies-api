import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async getTopMovies() {
    try {
      return await this.moviesService.getTopMovies();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
