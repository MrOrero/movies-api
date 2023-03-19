import {
    IsDate,
    IsDateString,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class AddMovieDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    title: string;

    @IsString()
    @MinLength(10)
    @MaxLength(200)
    overview: string;

    @IsDateString()
    releaseDate: string;
}
