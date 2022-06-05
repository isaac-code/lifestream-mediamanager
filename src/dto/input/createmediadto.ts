import { IsNotEmpty, IsEnum, IsOptional, IsDate } from "class-validator";


export class CreateMediaDTO {
    @IsOptional()
    name: string;

    @IsOptional()
    prettyName: string;

    @IsOptional()
    sourceLink: string;

    @IsOptional()
    thumbnailLink: string;

    @IsOptional()
    mediaChannel: string;

    @IsOptional()
    mediaCategory: string;

    @IsOptional()
    mediaTag: string;

    @IsOptional()
    minister: string;

    @IsOptional()
    description: string;

    @IsOptional()
    views: string;

    @IsOptional()
    likes: string;

    @IsOptional()
    dislikes: string;

    @IsOptional()
    trending: string;

    @IsOptional()
    trendingAt: string;

    @IsOptional()
    scheduleAt: string;

    @IsOptional()
    mediaLength: string;

    @IsOptional()
    subscribersNotified: string;

    constructor(
        name?: string,
        prettyName?: string,
        sourceLink?: string,
        thumbnailLink?: string,
        mediaChannel?: string,
        mediaCategory?: string,
        mediaTag?: string,
        minister?: string,
        description?: string,
        views?: string,
        likes?: string,
        dislikes?: string,
        trending?: string,
        trendingAt?: string,
        scheduleAt?: string,
        mediaLength?: string,
        subscribersNotified?: string
    ) {
        this.name = name;
        this.prettyName = prettyName;
        this.sourceLink = sourceLink;
        this.thumbnailLink = thumbnailLink;
        this.mediaChannel = mediaChannel;
        this.mediaCategory = mediaCategory;
        this.mediaTag = mediaTag;
        this.minister = minister;
        this.description = description;
        this.views = views;
        this.likes = likes;
        this.dislikes = dislikes;
        this.trending = trending;
        this.trendingAt = trendingAt;
        this.scheduleAt = scheduleAt;
        this.mediaLength = mediaLength;
        this.subscribersNotified = subscribersNotified;
    }
}
