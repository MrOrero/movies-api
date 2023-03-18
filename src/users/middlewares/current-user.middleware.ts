import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../users.service';

declare global {
    namespace Express {
        interface Request {
            currentUser?: IUser;
        }
    }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if (userId) {
            const user = await this.usersService.findById(userId);

            req.currentUser = user;
        }

        next();
    }
}
