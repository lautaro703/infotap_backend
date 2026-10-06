import { PartialType } from "@nestjs/mapped-types";
import { PostUsuarioCommand } from "./post.usuarios.command";

export class PutUsuarioCommand extends PartialType(PostUsuarioCommand){};