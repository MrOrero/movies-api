import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Session,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { IUser } from './interfaces/user.interface';
import { SigninUserDto } from './dtos/signin-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    //Testing sessions
    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color;
    }

    @Post('signup')
    async signup(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(
            body.email,
            body.password,
            body.username,
        );

        session.userId = user.id;

        return user;
    }

    @Post('signin')
    async signin(@Body() body: SigninUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);

        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    // Testing current user decorator
    @UseGuards(AuthGuard)
    @Get('/currentuser')
    async getCurrentUser(@CurrentUser() user: IUser) {
        return user;
    }
}
