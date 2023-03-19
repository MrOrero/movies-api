import { IsBoolean } from 'class-validator';

export class ApproveMovieDto {
    @IsBoolean()
    approved: boolean;
}
