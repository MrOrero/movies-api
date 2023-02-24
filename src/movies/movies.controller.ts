import {
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @Get()
    async getTopMovies() {
        const movies = await this.moviesService.getTopMovies();
        return movies;
    }
}
