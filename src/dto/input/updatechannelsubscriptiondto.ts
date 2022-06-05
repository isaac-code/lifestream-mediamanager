import { IsNotEmpty, IsEnum, IsOptional, IsDate } from "class-validator";


export class UpdateChannelSubscriptionDTO {
    @IsOptional()
    mediaChannel: string;

    @IsOptional()
    subscribed: boolean;

    @IsOptional()
    notifyMe: boolean;

    constructor(mediaChannel?: string, subscribed?: boolean, notifyMe?: boolean) {
        this.mediaChannel = mediaChannel;
        this.subscribed = subscribed;
        this.notifyMe = notifyMe;
    }
}
