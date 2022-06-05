import { BaseService } from "./baseservice";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { IChannelModel } from "../models/channel";
import { IChannelSubscriptionModel } from "../models/channelsubscription";
import { NextFunction, Request, Response } from "express";
import { CreateChannelDTO } from "../dto/input/createchanneldto";
import { UpdateChannelDTO } from "../dto/input/updatechanneldto";
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

export class ChannelService extends BaseService {
    @handleException()
    public async createChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let dto = new CreateChannelDTO(
            req.body.name,
            req.body.description,
            req.body.bannerImageLink,
            req.body.imageLink
        );

        let errors = await this.validateNewChannelDetails(dto, req, tenantId);
        if (this.hasErrors(errors)) {
            this.sendResponse(
                new BasicResponse(Status.FAILED_VALIDATION, errors),
                res
            );
            return next();
        }

        this.saveNewChannelData(req, res, next, userId, tenantId, dto);
    }

    @trailNewRecord("channel")
    async saveNewChannelData(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string,
        dto: CreateChannelDTO
    ) {
        const { name, description, bannerImageLink, imageLink } = dto;

        let channel: IChannelModel = req.app.locals.channel({
            userId,
            tenantId,
            name,
            description,
            bannerImageLink,
            imageLink
        });

        return channel;
    }

    hasErrors(errors) {
        return !(errors === undefined || errors.length == 0);
    }

    @list("channel")
    public async listChannel(req: Request, res: Response, next: NextFunction) {
        let variables = {
            sort: { createdAt: -1 },
            paramFilter: { isActive: true }
        };
        return variables;
    }

    @list("channel")
    public async listAllChannel(req: Request, res: Response, next: NextFunction) {
        let variables = {
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @list("channel")
    public async listChannelAuth(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: true,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @listOne("channel")
    public async listOneChannel(req: Request, res: Response, next: NextFunction) {
        let variables = {
            sort: { createdAt: -1 }
        };
        return variables;
    }

    public async updateChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        try {
            const { name, description, bannerImageLink, imageLink } = req.body;

            let dto = new UpdateChannelDTO(
                name,
                description,
                bannerImageLink,
                imageLink
            );
            await this.updateChannelData(dto, userId, tenantId, req, res);
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

    async updateChannelData(
        dto: UpdateChannelDTO,
        userId: string,
        tenantId: string,
        req: Request,
        res: Response
    ) {
        let existingChannel = null;
        let responseObj = null;
        await req.app.locals.channel
            .findOne({ _id: req.params.id, tenantId, userId })
            .then(result => {
                if (result) {
                    existingChannel = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        if (existingChannel) {
            dto.name ? (existingChannel.name = dto.name) : "";
            dto.description ? (existingChannel.description = dto.description) : "";
            dto.bannerImageLink
                ? (existingChannel.bannerImageLink = dto.bannerImageLink)
                : "";
            dto.imageLink ? (existingChannel.imageLink = dto.imageLink) : "";
            existingChannel.lastUpdatedAt = Date.now();
            await existingChannel
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

    @suspend("channel")
    public async suspendChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @unsuspend("channel")
    public async unSuspendChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @remove("channel")
    public async deleteChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    @removetotal("channel")
    public async deleteTotalChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    async validateNewChannelDetails(
        dto: CreateChannelDTO,
        req: Request,
        tenantId: string
    ) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
    }

    async verifyChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string,
        userType: string
    ) {
        let existingChannel = null;
        let responseObj = null;
        let doVerify = req.body.verify;
        doVerify = doVerify.toUpperCase();

        if (["maxsuperuser", "superuser", "superadmin", "admin"].includes(userType)) {
            if (doVerify == "YES" || doVerify == "NO") {
                await req.app.locals.channel
                    .findOne({ _id: req.params.id })
                    .then(result => {
                        if (result) {
                            existingChannel = result;
                        }
                    })
                    .catch(err => {
                        this.sendResponse(new BasicResponse(Status.ERROR, err), res);
                    });

                if (existingChannel) {
                    let verifyAction = doVerify == "YES" ? true : false;
                    existingChannel.isVerified = verifyAction;
                    existingChannel.lastUpdatedAt = Date.now();
                    await existingChannel
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
            } else {
                responseObj = new BasicResponse(Status.FAILED_VALIDATION);
            }
        } else {
            responseObj = new BasicResponse(Status.UNAUTHORIZED);
        }
        this.sendResponse(responseObj, res);
    }

    public async listUserChannelSubscription(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        await req.app.locals.channelsubscription
            .find({ userId, tenantId })
            .populate({ path: "mediaChannel" })
            .then(result => {
                if (result) {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, result), res);
                } else {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, []), res);
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });
    }

    public async listUserOneChannelSubscription(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        await req.app.locals.channelsubscription
            .findOne({ mediaChannel: req.params.channelId, userId, tenantId })
            .then(result => {
                if (result) {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, result), res);
                } else {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, []), res);
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });
    }

    async userChannelSubscription(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let existingChannel = null;
        let existingChannelSubscription = null;
        let responseObj = null;
        await req.app.locals.channel
            .findOne({ _id: req.params.channelId, tenantId })
            .then(result => {
                if (result) {
                    existingChannel = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        if (existingChannel) {
            await req.app.locals.channelsubscription
                .findOne({ mediaChannel: req.params.channelId, tenantId, userId })
                .then(result => {
                    if (result) {
                        existingChannelSubscription = result;
                    }
                })
                .catch(err => {
                    this.sendResponse(new BasicResponse(Status.ERROR, err), res);
                });

            if (existingChannelSubscription) {
                existingChannelSubscription.subscribed = true;
                await existingChannelSubscription
                    .save()
                    .then(result => {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    })
                    .catch(err => {
                        responseObj = new BasicResponse(Status.ERROR, err);
                    });
            } else {
                let channelSubscription: IChannelSubscriptionModel = req.app.locals.channelsubscription(
                    {
                        mediaChannel: req.params.channelId,
                        userId,
                        tenantId,
                        channel: req.query.channel
                    }
                );

                await channelSubscription
                    .save()
                    .then(result => {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    })
                    .catch(err => {
                        responseObj = new BasicResponse(Status.ERROR, err);
                    });
            }

            existingChannel.subscribers = parseInt(existingChannel.subscribers)
                ? parseInt(existingChannel.subscribers) + 1
                : 1;

            existingChannel.save();
        } else {
            responseObj = new BasicResponse(Status.NOT_FOUND, {
                msg: "Channel Not Found"
            });
        }

        this.sendResponse(responseObj, res);
    }

    async userChannelUnsubscription(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let existingChannel = null;
        let existingChannelSubscription = null;
        let responseObj = null;
        await req.app.locals.channel
            .findOne({ _id: req.params.channelId, tenantId })
            .then(result => {
                if (result) {
                    existingChannel = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        if (existingChannel) {
            await req.app.locals.channelsubscription
                .findOne({ mediaChannel: req.params.channelId, tenantId, userId })
                .then(result => {
                    if (result) {
                        existingChannelSubscription = result;
                    }
                })
                .catch(err => {
                    this.sendResponse(new BasicResponse(Status.ERROR, err), res);
                });

            if (existingChannelSubscription) {
                existingChannelSubscription.subscribed = false;
                existingChannelSubscription.notifyMe = false;
                await existingChannelSubscription
                    .save()
                    .then(result => {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    })
                    .catch(err => {
                        responseObj = new BasicResponse(Status.ERROR, err);
                    });

                parseInt(existingChannel.subscribers)
                    ? (existingChannel.subscribers =
                        parseInt(existingChannel.subscribers) - 1)
                    : "";

                existingChannel.save();
            } else {
                responseObj = new BasicResponse(Status.SUCCESS);
            }
        } else {
            responseObj = new BasicResponse(Status.NOT_FOUND, {
                msg: "Channel Not Found"
            });
        }

        this.sendResponse(responseObj, res);
    }

    async userChannelNotify(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let existingChannel = null;
        let existingChannelSubscription = null;
        let responseObj = null;
        await req.app.locals.channel
            .findOne({ _id: req.params.channelId, tenantId })
            .then(result => {
                if (result) {
                    existingChannel = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        if (existingChannel) {
            await req.app.locals.channelsubscription
                .findOne({ mediaChannel: req.params.channelId, tenantId, userId })
                .then(result => {
                    if (result) {
                        existingChannelSubscription = result;
                    }
                })
                .catch(err => {
                    this.sendResponse(new BasicResponse(Status.ERROR, err), res);
                });

            if (existingChannelSubscription) {
                existingChannelSubscription.subscribed = true;
                existingChannelSubscription.notifyMe = true;
                await existingChannelSubscription
                    .save()
                    .then(result => {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    })
                    .catch(err => {
                        responseObj = new BasicResponse(Status.ERROR, err);
                    });
            } else {
                let channelSubscription: IChannelSubscriptionModel = req.app.locals.channelsubscription(
                    {
                        mediaChannel: req.params.channelId,
                        notifyMe: true,
                        userId,
                        tenantId,
                        channel: req.query.channel
                    }
                );

                await channelSubscription
                    .save()
                    .then(result => {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    })
                    .catch(err => {
                        responseObj = new BasicResponse(Status.ERROR, err);
                    });
            }
        } else {
            responseObj = new BasicResponse(Status.NOT_FOUND, {
                msg: "Channel Not Found"
            });
        }

        this.sendResponse(responseObj, res);
    }

    async userChannelUnnotify(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let existingChannel = null;
        let existingChannelSubscription = null;
        let responseObj = null;
        await req.app.locals.channel
            .findOne({ _id: req.params.channelId, tenantId })
            .then(result => {
                if (result) {
                    existingChannel = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });

        if (existingChannel) {
            await req.app.locals.channelsubscription
                .findOne({ mediaChannel: req.params.channelId, tenantId, userId })
                .then(result => {
                    if (result) {
                        existingChannelSubscription = result;
                    }
                })
                .catch(err => {
                    this.sendResponse(new BasicResponse(Status.ERROR, err), res);
                });

            if (existingChannelSubscription) {
                existingChannelSubscription.notifyMe = false;
                await existingChannelSubscription
                    .save()
                    .then(result => {
                        responseObj = new BasicResponse(Status.SUCCESS, result);
                    })
                    .catch(err => {
                        responseObj = new BasicResponse(Status.ERROR, err);
                    });
            } else {
                responseObj = new BasicResponse(Status.SUCCESS);
            }
        } else {
            responseObj = new BasicResponse(Status.NOT_FOUND, {
                msg: "Channel Not Found"
            });
        }

        this.sendResponse(responseObj, res);
    }

    public async listUserChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let userIdQuery = req.query.userId;
        if (userIdQuery == userId) {
            this.doListUserChannel(req, res, next, userId, tenantId);
        } else {
            this.sendResponse(new BasicResponse(Status.NOT_FOUND), res);
        }
    }

    @list("channel")
    public async doListUserChannel(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            sort: { createdAt: -1 }
        };
        return variables;
    }
}
