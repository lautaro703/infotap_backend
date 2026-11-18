import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AnalisisDto } from '../dto/analisis.dto';
import { PostAnalisisCommand } from '../../service/dtos/post.analisisi.command';
import { GetAnalisisQuery } from '../../service/dtos/get.analisis.query';
import { AnalisisService } from '../../service/analisis.service';
import { DeleteAnalisisCommand } from '../../service/dtos/delete.analisis.command';
@Controller('analisis')
export class AnalisisController {
    constructor(private readonly analisisService:AnalisisService){}
    @Get()
    findAll(){
        return this.analisisService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        const analisis = await this.analisisService.findById(new GetAnalisisQuery(id));
        return AnalisisDto.fromEntity(analisis);
    }

    @Post()
    async create(@Body() command: PostAnalisisCommand){
        const analisis = await this.analisisService.create(command);
        return AnalisisDto.fromEntity(analisis);
    }

    @Delete('id')
    delete(@Param('id')id:number){DeleteAnalisisCommand}
}
