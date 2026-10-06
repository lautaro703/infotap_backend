import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BarriosService } from '../../service/barrios.service';
import { DeleteBarrioCommand } from '../../service/dtos/delete.barrios.command';
import { PutBarrioCommand } from '../../service/dtos/put.barrio.command';
import { GetBarrioQuery } from '../../service/dtos/get.barrios.query';

@Controller('barrios')
export class BarriosController {
    
    constructor(private readonly barrioService:BarriosService){}

    @Get()
    async findAll(){
        return await this.barrioService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.barrioService.findById({id: Number(id)})
    }

    @Post()
    async create(@Body()command:any){
        return await this.barrioService.create(command)
    }

    @Put(':id')
    update(@Param('id') id:number, @Body() command: PutBarrioCommand){
        return this.barrioService.update({ id } as GetBarrioQuery,command);
    }

    @Delete(':id')
    delete(@Param('id')id:number){
        return this.barrioService.delete({id} as DeleteBarrioCommand);
    }
}
