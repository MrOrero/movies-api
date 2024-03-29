import { Expose } from 'class-transformer';

export class MovieDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    overview: string;

    @Expose()
    releaseDate: string;

    @Expose()
    ratings: [{}];
}
