import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CiudadService } from '../../service/ciudad.service';
import { CiudadDto } from '../dto/ciudad.dto';
import { GetCiudadQuery } from '../../service/dtos/get.ciudad.query';
import { PostCiudadCommand } from '../../service/dtos/post.ciudad.command';
import { PutCiudadCommand } from '../../service/dtos/put.ciudad.command';
import { DeleteCiudadCommand } from '../../service/dtos/delete.ciudad.command';

@Controller('ciudad')
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService){}

    @Get()
    findAll(){
        return this.ciudadService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        const ciudad = await this.ciudadService.findById(new GetCiudadQuery(id));
        return CiudadDto.fromEntity(ciudad);
    }

    @Post()
    async create(@Body() command: PostCiudadCommand){
        const ciudad = await this.ciudadService.create(command);
        return CiudadDto.fromEntity(ciudad);
    }

    @Put(':id')
    update(@Param('id') id:number, @Body() command: PutCiudadCommand){
        return this.ciudadService.update({ id } as GetCiudadQuery,command);
    }

    @Delete('id')
    delete(@Param('id')id:number){
     return this.ciudadService.delete({id} as DeleteCiudadCommand);
    }
}
