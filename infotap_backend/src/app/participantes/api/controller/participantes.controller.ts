import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ParticipantesService } from '../../service/participantes.service';
import { ParticipanteDto } from '../dto/participantes.dto';
import { PostParticipanteCommand } from '../../service/dtos/post.participantes.command';
import { DeleteParticipanteCommand } from '../../service/dtos/delete.participantes.command';
import { GetParticipanteQuery } from '../../service/dtos/get.participantes.query';

@Controller('participantes')
export class ParticipantesController {
    constructor(private readonly participanteService: ParticipantesService){}

    @Get()
    findAll(){
        return this.participanteService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        const participante = await this.participanteService.findById(new GetParticipanteQuery(id));
        return ParticipanteDto.fromEntity(participante);
    }

    @Post()
    async create(@Body() command: PostParticipanteCommand){
        const participante = await this.participanteService.create(command);
        return ParticipanteDto.fromEntity(participante);
    }

    @Delete('id')
    delete(@Param('id')id:number){
     return this.participanteService.delete({id} as DeleteParticipanteCommand);
    }
}
