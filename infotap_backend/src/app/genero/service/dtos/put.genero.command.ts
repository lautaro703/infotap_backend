import { PartialType } from "@nestjs/mapped-types";
import { PostGeneroCommand } from "./post.genero.command";

export class PutGeneroCommand extends PartialType(PostGeneroCommand){}