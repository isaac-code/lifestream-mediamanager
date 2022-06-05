import { BaseService } from "./baseservice";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { IChannelLinkModel } from "../models/channellink";
import { NextFunction, Request, Response } from "express";
import { CreateChannelLinkDTO } from "../dto/input/createchannellinkdto";
import { UpdateChannelLinkDTO } from "../dto/input/updatechannellinkdto";
import { validateSync } from "class-validator";
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

export class ChannelLinkService extends BaseService {
    @handleException()
    public async createChannelLink(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let dto = new CreateChannelLinkDTO(
            req.body.mediaChannel,
            req.body.linkKey,
            req.body.linkValue
        );

        let errors = await this.validateNewChannelLinkDetails(dto, req, tenantId);
        if (this.hasErrors(errors)) {
            this.sendResponse(
                new BasicResponse(Status.FAILED_VALIDATION, errors),
                res
            );
            return next();
        }

        this.saveNewChannelLinkData(req, res, next, userId, tenantId, dto);
    }

    @trailNewRecord("channelLink")
    async saveNewChannelLinkData(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string,
        dto: CreateChannelLinkDTO
    ) {
        const { mediaChannel, linkKey, linkValue } = dto;

        let channellink: IChannelLinkModel = req.app.locals.channellink({
            userId,
            tenantId,
            mediaChannel,
            linkKey,
            linkValue
        });

        return channellink;
    }

    hasErrors(errors) {
        return !(errors === undefined || errors.length == 0);
    }

    @list("channelLink")
    public async listChannelLink(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        let variables = {
            tenant: true,
            sort: { createdAt: -1 },
            populateField: [{ path: "mediaChannel" }]
        };
        return variables;
    }

    @listOne("channelLink")
    public async listOneChannelLink(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        let variables = {
            tenant: true,
            sort: { createdAt: -1 },
            populateField: [{ path: "mediaChannel" }]
        };
        return variables;
    }

    @suspend("channelLink")
    public async suspendChannelLink(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @unsuspend("channelLink")
    public async unSuspendChannelLink(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @remove("channelLink")
    public async deleteChannelLink(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @removetotal("channelLink")
    public async deleteTotalChannelLink(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    public async updateChannelLink(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        try {
            const { mediaChannel, linkKey, linkValue } = req.body;

            let dto = new UpdateChannelLinkDTO(mediaChannel, linkKey, linkValue);
            await this.updateChannelLinkData(dto, userId, tenantId, req, res);
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

    async updateChannelLinkData(
        dto: UpdateChannelLinkDTO,
        userId: string,
        tenantId: string,
        req: Request,
        res: Response
    ) {
        let existingChannelLink = null;
        let responseObj = null;
        await req.app.locals.channellink
            .findOne({ _id: req.params.id, tenantId, userId })
            .then(result => {
                if (result) {
                    existingChannelLink = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        let itemMediaChannel: any;
        if (dto.mediaChannel && Array.isArray(dto.mediaChannel)) {
            itemMediaChannel = dto.mediaChannel;
        } else if (
            dto.mediaChannel &&
            existingChannelLink.mediaChannel &&
            Array.isArray(existingChannelLink.mediaChannel)
        ) {
            let oldData = existingChannelLink.mediaChannel;
            oldData.push(dto.mediaChannel);
            itemMediaChannel = oldData;
        } else if (dto.mediaChannel && existingChannelLink.mediaChannel) {
            let oldData = [existingChannelLink.mediaChannel];
            oldData.push(dto.mediaChannel);
            itemMediaChannel = oldData;
        } else {
            itemMediaChannel = dto.mediaChannel;
        }

        if (existingChannelLink) {
            itemMediaChannel
                ? (existingChannelLink.mediaChannel = itemMediaChannel)
                : "";
            dto.linkKey ? (existingChannelLink.linkKey = dto.linkKey) : "";
            dto.linkValue ? (existingChannelLink.linkValue = dto.linkValue) : "";
            existingChannelLink.lastUpdatedAt = Date.now();
            await existingChannelLink
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

    async validateNewChannelLinkDetails(
        dto: CreateChannelLinkDTO,
        req: Request,
        tenantId: string
    ) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
    }
}
