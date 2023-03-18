import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
// const bcrypt = require('bcryptjs');
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string, username: string) {
        // See if email is in use
        const user = await this.usersService.findOne(email);
        if (user) {
            throw new BadRequestException('Email already in use');
        }

        // Hash the users password
        const hashedPassword = await hash(password, 10);

        // admin = true

        // Create a new user and save it
        const newUser = await this.usersService.create({
            email,
            password: hashedPassword,
            username,
        });

        return newUser;
    }

    async signin(email: string, password: string) {
        const existingUser = await this.usersService.findOne(email);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        const isEqual = await compare(password, existingUser.password);
        if (!isEqual) {
            throw new BadRequestException('incorrect username or password');
        }

        return existingUser;
    }
}
