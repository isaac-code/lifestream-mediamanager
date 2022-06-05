import { IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { coreType } from "../enums/validationenum";

export class UpdateMediaTagDTO {
    @IsOptional()
    name: string;

    @IsOptional()
    prettyName: string;

    @IsOptional()
    image: string;

    @IsOptional()
    @IsEnum(coreType, {
        message: "Core Type should only contain music, sermon or music-sermon"
    })
    coreType: string;

    constructor(name?: string, prettyName?: string, image?: string, coreType?: string) {
        this.name = name;
        this.prettyName = prettyName;
        this.image = image;
        this.coreType = coreType;
    }
}
