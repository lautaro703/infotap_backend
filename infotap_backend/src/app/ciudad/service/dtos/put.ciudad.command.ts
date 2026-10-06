import { PostCiudadCommand } from "./post.ciudad.command";
import { PartialType } from "@nestjs/mapped-types";

export class PutCiudadCommand extends PartialType(PostCiudadCommand){};