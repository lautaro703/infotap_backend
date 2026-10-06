import { PartialType } from "@nestjs/mapped-types";
import { PostBarrioCommand } from "./post.barrios.command";

export class PutBarrioCommand extends PartialType(PostBarrioCommand){};