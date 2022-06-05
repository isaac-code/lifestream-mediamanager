import { IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { coreType, office } from "../enums/validationenum";

export class CreateMinisterDTO {

    @IsNotEmpty({
        message: 'Name is required'
    })
    name: string;

    @IsOptional()
    prettyName: string;

    @IsOptional()
    image: string;

    @IsOptional()
    ministry: string;

    @IsNotEmpty({
        message: 'Core Type is required'
    })
    @IsEnum(coreType, {
        message: 'Core Type should only contain music, sermon or music-sermon'
    })
    coreType: string;

    @IsOptional()
    @IsEnum(office, {
        message: 'Office should only contain apostle, prophet, evangelist, pastor, teacher'
    })
    office: string;

    constructor(name?: string, prettyName?: string, image?: string, ministry?: string, coreType?: string, office?: string) {
        this.name = name;
        this.prettyName = prettyName;
        this.image = image;
        this.ministry = ministry;
        this.coreType = coreType;
        this.office = office;
    }

}