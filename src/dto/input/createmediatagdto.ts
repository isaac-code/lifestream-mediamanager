import { IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { coreType } from "../enums/validationenum";

export class CreateMediaTagDTO {
    @IsNotEmpty({
        message: "Name is required"
    })
    name: string;

    @IsOptional()
    prettyName: string;

    @IsOptional()
    image: string;

    @IsNotEmpty({
        message: "Core Type is required"
    })
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
