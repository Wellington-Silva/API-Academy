import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('instructors')
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) { };

    @UseGuards(JwtAuthGuard)
    @Get()
    async list() {
        return this.instructorsService.list();
    };

    @UseGuards(JwtAuthGuard)
    @Get()
    async getByEmail(@Query('email') email: string) {
        return this.instructorsService.getByEmail(email);
    };

    @Post('register')
    async register(@Body() body: { name: string; email: string; password: string }) {
        return this.instructorsService.register(body.name, body.email, body.password);
    };

};
