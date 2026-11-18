import { PartialType } from "@nestjs/mapped-types";
import { PostAnalisisCommand } from "./post.analisisi.command";

export class PutAnalisisCommand extends PartialType(PostAnalisisCommand){};