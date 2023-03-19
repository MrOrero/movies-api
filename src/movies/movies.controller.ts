import { Controller, Get, NotFoundException } from '@nestjs/common';
import { Body, Param, Post, UseGuards } from '@nestjs/common/decorators';
import { AdminGuard } from 'src/guard/admin.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { IUser } from 'src/users/interfaces/user.interface';
import { AddMovieDto } from './dtos/add-movie.dto';
import { ApproveMovieDto } from './dtos/approve-movie.dto';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    // get all movies
    @Get()
    async getTopMovies() {
        const movies = await this.moviesService.getTopMovies();
        return movies;
    }

    // get movie by id
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

    // Add movie - must be approved
    @UseGuards(AuthGuard)
    @Post('add')
    async addMovie(@Body() body: AddMovieDto, @CurrentUser() user: IUser) {
        const movie = await this.moviesService.addMovie(body, user.id);
        return movie;
    }

    // approve movie
    @UseGuards(AuthGuard)
    @UseGuards(AdminGuard)
    @Post('approve/:movieId')
    async approveMovie(
        @Body() body: ApproveMovieDto,
        @Param('movieId') movieId: string,
    ) {
        const movie = await this.moviesService.approveMovie(
            movieId,
            body.approved,
        );
        return movie;
    }

    // get user ratings
    @UseGuards(AuthGuard)
    @Get('user/all')
    async getTopMoviesForUser(@CurrentUser() user: IUser) {
        const movies = await this.moviesService.getTopMoviesForUser(user.id);
        return movies;
    }

    // get movie for user with rating
    @UseGuards(AuthGuard)
    @Get('user/:movieId')
    async getMovieForUser(
        @CurrentUser() user: IUser,
        @Param('movieId') movieId: string,
    ) {
        const movie = await this.moviesService.getMovieForUser(
            movieId,
            user.id,
        );
        return movie;
    }

    // Watched, want to watch, Not interested

    // add to watchlist

    // seach for movies

    // implement pagination

    // reviews maybe
}
