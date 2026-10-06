import { Body, Controller, Get, Param,Delete, Post } from '@nestjs/common';
import { GeneroService } from '../../service/genero.service';
import { get } from 'http';
import { DeleteGeneroCommand } from '../../service/dtos/delete.genero.command';
import { CannotGetEntityManagerNotConnectedError } from 'typeorm';

@Controller('genero')
export class GeneroController {
    constructor(private readonly generoService:GeneroService){}

    @Get()
    async findAll(){
        return await this.generoService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.generoService.findById({id: Number(id)})
    }

    @Post()
    async create(@Body()command:any){
        return await this.generoService.create(command)
    }

    @Delete(':id')
    delete(@Param('id')id:number){
        return this.generoService.delete({id} as DeleteGeneroCommand);
    }
}
