import { BaseService } from "./baseservice";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { IMediaModel } from "../models/media";
import { NextFunction, Request, Response } from "express";
import { CreateMediaDTO } from "../dto/input/createmediadto";
import { UpdateMediaDTO } from "../dto/input/updatemediadto";
import { validateSync, IsNumberString } from "class-validator";
import {
    trailNewRecord,
    handleException,
    list,
    listOne,
    suspend,
    unsuspend,
    remove,
    removetotal
} from "../aspects/audittrailaspects";

export class MediaService extends BaseService {
    @handleException()
    public async createMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let dto = new CreateMediaDTO(
            req.body.name,
            req.body.prettyName,
            req.body.sourceLink,
            req.body.thumbnailLink,
            req.body.mediaChannel,
            req.body.mediaCategory,
            req.body.mediaTag,
            req.body.minister,
            req.body.description,
            req.body.views,
            req.body.likes,
            req.body.dislikes,
            req.body.trending,
            req.body.trendingAt,
            req.body.scheduleAt,
            req.body.mediaLength
        );

        let errors = await this.validateNewMediaDetails(dto, req, tenantId);
        if (this.hasErrors(errors)) {
            this.sendResponse(
                new BasicResponse(Status.FAILED_VALIDATION, errors),
                res
            );
            return next();
        }

        this.saveNewMediaData(req, res, next, userId, tenantId, dto);
    }

    @trailNewRecord("media")
    async saveNewMediaData(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string,
        dto: CreateMediaDTO
    ) {
        let {
            name,
            prettyName,
            sourceLink,
            thumbnailLink,
            mediaChannel,
            mediaCategory,
            mediaTag,
            minister,
            description,
            views,
            likes,
            dislikes,
            trending,
            trendingAt,
            scheduleAt,
            mediaLength
        } = dto;

        let defaultChannel = null;
        await req.app.locals.channel.findOne({ tenantId, userId }).then(result => {
            if (result) {
                defaultChannel = result;
            }
        });

        !mediaChannel && defaultChannel ? (mediaChannel = defaultChannel._id) : "";

        const secret = { sourceLink };

        let media: IMediaModel = req.app.locals.media({
            secret,
            userId,
            tenantId,
            name,
            prettyName,
            thumbnailLink,
            mediaChannel,
            mediaCategory,
            mediaTag,
            minister,
            description,
            views,
            likes,
            dislikes,
            trending,
            trendingAt,
            scheduleAt,
            mediaLength
        });

        return media;
    }

    hasErrors(errors) {
        return !(errors === undefined || errors.length == 0);
    }

    @list("media")
    public async listMedia(req: Request, res: Response, next: NextFunction) {
        this.updateEntitiesWithItsPrettyName(req);
        let variables = {
            sort: { createdAt: -1 },
            paramFilter: { isActive: true },
            populateField: [{ path: "mediaChannel" }, { path: "mediaTag" }, { path: "minister" }]
        };
        return variables;
    }

    isMissing(param) {
        return !param;
    }

    isNotANumber(param) {
        return !(IsNumberString(param) || Number.isInteger(param));
    }

    public async searchMedia(req: Request, res: Response, next: NextFunction) {
        let existingMedia = null;
        let filterName = req.body.filterName;
        let offsetQuery: any = req.query.offset;
        let offset = parseInt(offsetQuery);
        let limitQuery: any = req.query.limit;
        let limit = parseInt(limitQuery);
        if (this.isMissing(offset) || this.isNotANumber(offset)) {
            offset = 0;
        }
        if (this.isMissing(limit) || this.isNotANumber(limit)) {
            limit = 50;
        }
        if (filterName) {
            //.find({ name: { $regex: filterName, $options: "i" }, isActive: true })
            await req.app.locals.media
                .find({ $text: { $search: filterName }, isActive: true })
                .sort({ createdAt: -1 })
                .populate({ path: "mediaChannel" })
                .skip(offset)
                .limit(limit)
                .then(result => {
                    if (result) {
                        existingMedia = result;
                    }
                })
                .catch(err => {
                    this.sendResponse(new BasicResponse(Status.ERROR, err), res);
                });
        }

        if (existingMedia) {
            this.sendResponse(new BasicResponse(Status.SUCCESS, existingMedia), res);
        } else {
            this.sendResponse(new BasicResponse(Status.NOT_FOUND), res);
        }
    }

    @listOne("media")
    public async listOneMedia(req: Request, res: Response, next: NextFunction) {
        let variables = {
            sort: { createdAt: -1 },
            populateField: [{ path: "minister" }]
        };
        return variables;
    }

    @suspend("media")
    public async suspendMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    public async unSuspendMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let existingMedia = null;
        await req.app.locals.media
            .findOne({ _id: req.params.id, tenantId, userId })
            .populate({ path: "mediaChannel" })
            .then(result => {
                if (result) {
                    existingMedia = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        if (
            existingMedia &&
            existingMedia.mediaChannel &&
            existingMedia.mediaChannel[0] &&
            existingMedia.mediaChannel[0].isVerified
        ) {
            this.doUnSuspendMedia(req, res, next, userId, tenantId);
        } else {
            this.sendResponse(
                new BasicResponse(Status.FAILED_VALIDATION, {
                    err: "Channel Unverified"
                }),
                res
            );
        }
    }

    @unsuspend("media")
    public async doUnSuspendMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @remove("media")
    public async deleteMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        // TODO: call fileserver to remove file
    }

    @removetotal("media")
    public async deleteTotalMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        // TODO: call fileserver to remove file
    }

    public async updateMedia(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        try {
            const {
                name,
                prettyName,
                sourceLink,
                thumbnailLink,
                mediaChannel,
                mediaCategory,
                mediaTag,
                minister,
                description,
                views,
                likes,
                dislikes,
                trending,
                trendingAt,
                scheduleAt,
                mediaLength
            } = req.body;

            let dto = new UpdateMediaDTO(
                name,
                prettyName,
                sourceLink,
                thumbnailLink,
                mediaChannel,
                mediaCategory,
                mediaTag,
                minister,
                description,
                views,
                likes,
                dislikes,
                trending,
                trendingAt,
                scheduleAt,
                mediaLength
            );
            await this.updateMediaData(dto, userId, tenantId, req, res);
            return next();
        } catch (ex) {
            this.sendException(
                ex,
                new BasicResponse(Status.ERROR, ex),
                req,
                res,
                next
            );
        }
    }

    async updateMediaData(
        dto: UpdateMediaDTO,
        userId: string,
        tenantId: string,
        req: Request,
        res: Response
    ) {
        let existingMedia = null;
        let defaultChannel = null;
        let responseObj = null;
        await req.app.locals.media
            .findOne({ _id: req.params.id, tenantId, userId })
            .then(result => {
                if (result) {
                    existingMedia = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        await req.app.locals.channel
            .findOne({ tenantId, userId })
            .then(result => {
                if (result) {
                    defaultChannel = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        let itemMediaTag: any;
        if (dto.mediaTag && Array.isArray(dto.mediaTag)) {
            itemMediaTag = dto.mediaTag;
        } else if (
            dto.mediaTag &&
            existingMedia.mediaTag &&
            Array.isArray(existingMedia.mediaTag)
        ) {
            let oldData = existingMedia.mediaTag;
            oldData.push(dto.mediaTag);
            itemMediaTag = oldData;
        } else if (dto.mediaTag && existingMedia.mediaTag) {
            let oldData = [existingMedia.mediaTag];
            oldData.push(dto.mediaTag);
            itemMediaTag = oldData;
        } else {
            itemMediaTag = dto.mediaTag;
        }

        let itemMediaMinister: any;
        if (dto.minister && Array.isArray(dto.minister)) {
            itemMediaMinister = dto.minister;
        } else if (
            dto.minister &&
            existingMedia.minister &&
            Array.isArray(existingMedia.minister)
        ) {
            let oldData = existingMedia.minister;
            oldData.push(dto.minister);
            itemMediaMinister = oldData;
        } else if (dto.minister && existingMedia.minister) {
            let oldData = [existingMedia.minister];
            oldData.push(dto.minister);
            itemMediaMinister = oldData;
        } else {
            itemMediaMinister = dto.minister;
        }

        let itemMediaChannel: any;
        if (dto.mediaChannel && Array.isArray(dto.mediaChannel)) {
            itemMediaChannel = dto.mediaChannel;
        } else if (
            dto.mediaChannel &&
            existingMedia.mediaChannel &&
            Array.isArray(existingMedia.mediaChannel)
        ) {
            let oldData = existingMedia.mediaChannel;
            oldData.push(dto.mediaChannel);
            itemMediaChannel = oldData;
        } else if (dto.mediaChannel && existingMedia.mediaChannel) {
            let oldData = [existingMedia.mediaChannel];
            oldData.push(dto.mediaChannel);
            itemMediaChannel = oldData;
        } else {
            itemMediaChannel = dto.mediaChannel;
        }

        let itemMediaCategory: any;
        if (dto.mediaCategory && Array.isArray(dto.mediaCategory)) {
            itemMediaCategory = dto.mediaCategory;
        } else if (
            dto.mediaCategory &&
            existingMedia.mediaCategory &&
            Array.isArray(existingMedia.mediaCategory)
        ) {
            let oldData = existingMedia.mediaCategory;
            oldData.push(dto.mediaCategory);
            itemMediaCategory = oldData;
        } else if (dto.mediaCategory && existingMedia.mediaCategory) {
            let oldData = [existingMedia.mediaCategory];
            oldData.push(dto.mediaCategory);
            itemMediaCategory = oldData;
        } else {
            itemMediaCategory = dto.mediaCategory;
        }

        let itemThumbnailLink: any;
        if (dto.thumbnailLink && Array.isArray(dto.thumbnailLink)) {
            itemThumbnailLink = dto.thumbnailLink;
        } else if (
            dto.thumbnailLink &&
            existingMedia.thumbnailLink &&
            Array.isArray(existingMedia.thumbnailLink)
        ) {
            let oldData = existingMedia.thumbnailLink;
            oldData.push(dto.thumbnailLink);
            itemThumbnailLink = oldData;
        } else if (dto.thumbnailLink && existingMedia.thumbnailLink) {
            let oldData = [existingMedia.thumbnailLink];
            oldData.push(dto.thumbnailLink);
            itemThumbnailLink = oldData;
        } else {
            itemThumbnailLink = dto.thumbnailLink;
        }

        !itemMediaChannel || itemMediaChannel.length == 0
            ? (itemMediaChannel = defaultChannel && defaultChannel._id)
            : "";

        if (existingMedia) {
            dto.name ? (existingMedia.name = dto.name) : "";
            dto.prettyName ? (existingMedia.prettyName = dto.prettyName) : "";
            dto.sourceLink ? (existingMedia.secret.sourceLink = dto.sourceLink) : "";
            itemMediaChannel ? (existingMedia.mediaChannel = itemMediaChannel) : "";
            itemMediaTag ? (existingMedia.mediaTag = itemMediaTag) : "";
            itemMediaMinister ? (existingMedia.minister = itemMediaMinister) : "";
            itemMediaCategory
                ? (existingMedia.mediaCategory = itemMediaCategory)
                : "";
            itemThumbnailLink
                ? (existingMedia.thumbnailLink = itemThumbnailLink)
                : "";
            dto.description ? (existingMedia.description = dto.description) : "";
            dto.scheduleAt ? (existingMedia.scheduleAt = dto.scheduleAt) : "";
            /* dto.views ? (existingMedia.views = dto.views) : "";
            dto.likes ? (existingMedia.likes = dto.likes) : "";
            dto.dislikes ? (existingMedia.dislikes = dto.dislikes) : "";
            dto.trending ? (existingMedia.trending = dto.trending) : "";
            dto.trendingAt ? (existingMedia.trendingAt = dto.trendingAt) : ""; */
            existingMedia.lastUpdatedAt = Date.now();
            await existingMedia
                .save()
                .then(result => {
                    if (!result) {
                        responseObj = new BasicResponse(Status.ERROR);
                    } else {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    }
                })
                .catch(err => {
                    responseObj = new BasicResponse(Status.ERROR, err);
                });
        } else {
            responseObj = new BasicResponse(Status.NOT_FOUND);
        }

        this.sendResponse(responseObj, res);
    }

    async validateNewMediaDetails(
        dto: CreateMediaDTO,
        req: Request,
        tenantId: string
    ) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
    }
}
