import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) { };

    @Get()
    async list() {
        return this.instructorsService.list();
    };

    @Get()
    async getByEmail(@Query('email') email: string) {
        return this.instructorsService.getByEmail(email);
    };

    @Post('register')
    async register(@Body() body: { name: string; email: string; password: string }) {
        return this.instructorsService.register(body.name, body.email, body.password);
    };

};
