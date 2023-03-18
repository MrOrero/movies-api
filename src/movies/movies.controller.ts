import { Controller, Get } from '@nestjs/common';
import { Body, Param, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from 'src/guard/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @Get()
    async getTopMovies() {
        const movies = await this.moviesService.getTopMovies();
        return movies;
    }

    @Get(':movieId')
    async getMovie(@Param('movieId') movieId: string) {
        const movie = await this.moviesService.getMovie(movieId);
        return movie;
    }

    @UseGuards(AuthGuard)
    @Post('rate/:movieId')
    async rateMovie(
        @Body() body: RateMovieDto,
        @Param('movieId') movieId: string,
        @CurrentUser() user: IUser,
    ) {
        const { rating } = body;
        const movie = await this.moviesService.rateMovie(
            movieId,
            rating,
            user.id,
        );
        return movie;
    }

    // Create movie - must be approved

    // Watched, want to watch, Not interested

    // favorite list

    // add to watchlist
}
