import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProvinciaService } from '../../service/provincia.service';

@Controller('provincia')
export class ProvinciaController {
    constructor(private readonly provinciaService:ProvinciaService){}

    @Get()
    async findAll(){
        return await this.provinciaService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.provinciaService.findById({id: Number(id)})
    }

    @Post()
    async create(@Body()command:any){
        return await this.provinciaService.create(command)
    }   
}
