import { Expose, Transform } from 'class-transformer';

export class ReportDto {
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
