import { IsNumber, Min, Max } from 'class-validator';

export class RateMovieDto {
    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;
}
