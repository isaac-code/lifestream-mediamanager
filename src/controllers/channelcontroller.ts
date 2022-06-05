import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./basecontroller";
import { BasicResponse } from "../dto/output/basicresponse";
import { ChannelService } from "../services/channelservice";

export class ChannelController extends BaseController {
    public loadRoutes(prefix: String, router: Router) {
        this.createChannel(prefix, router);
        this.listChannel(prefix, router);
        this.listAllChannel(prefix, router);
        this.listChannelAuth(prefix, router);
        this.channel(prefix, router);
        this.updateChannel(prefix, router);
        this.suspendChannel(prefix, router);
        this.unSuspendChannel(prefix, router);
        this.deleteChannel(prefix, router);
        this.deleteTotalChannel(prefix, router);
        this.verifyChannel(prefix, router);

        this.listUserChannelSubscription(prefix, router);
        this.listUserOneChannelSubscription(prefix, router);
        this.userChannelSubscription(prefix, router);
        this.userChannelUnsubscription(prefix, router);
        this.userChannelNotify(prefix, router);
        this.userChannelUnnotify(prefix, router);

        this.listUserChannel(prefix, router);
    }

    //Channel

    public createChannel(prefix: String, router: Router): any {
        router.post(
            prefix + "/data",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().createChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public listChannel(prefix: String, router: Router): any {
        router.get(
            prefix + "/data/",
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listChannel(req, res, next);
            }
        );
    }

    public listAllChannel(prefix: String, router: Router): any {
        router.get(
            prefix + "/data/all",
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listAllChannel(req, res, next);
            }
        );
    }

    public listChannelAuth(prefix: String, router: Router): any {
        router.get(
            prefix + "/auth/data/",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listChannelAuth(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public channel(prefix: String, router: Router): any {
        router.get(
            prefix + "/data/:id",
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listOneChannel(req, res, next);
            }
        );
    }

    public updateChannel(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().updateChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public suspendChannel(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/suspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().suspendChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public unSuspendChannel(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/unsuspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().unSuspendChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public deleteChannel(prefix: String, router: Router): any {
        router.delete(
            prefix + "/data/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().deleteChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public deleteTotalChannel(prefix: String, router: Router): any {
        router.delete(
            prefix + "/data/total/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().deleteTotalChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public verifyChannel(prefix: String, router: Router): any {
        router.put(
            prefix + "/verify/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().verifyChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId,
                    this.user_userType
                );
            }
        );
    }

    public listUserChannelSubscription(prefix: String, router: Router): any {
        router.get(
            prefix + "/user/subscription/",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listUserChannelSubscription(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public listUserOneChannelSubscription(prefix: String, router: Router): any {
        router.get(
            prefix + "/user/onesubscription/:channelId",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listUserOneChannelSubscription(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public userChannelSubscription(prefix: String, router: Router): any {
        router.put(
            prefix + "/user/subscription/:channelId",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().userChannelSubscription(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public userChannelUnsubscription(prefix: String, router: Router): any {
        router.put(
            prefix + "/user/unsubscription/:channelId",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().userChannelUnsubscription(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public userChannelNotify(prefix: String, router: Router): any {
        router.put(
            prefix + "/user/notify/:channelId",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().userChannelNotify(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public userChannelUnnotify(prefix: String, router: Router): any {
        router.put(
            prefix + "/user/unnotify/:channelId",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().userChannelUnnotify(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public listUserChannel(prefix: String, router: Router): any {
        router.get(
            prefix + "/user/data/",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new ChannelService().listUserChannel(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public authorize(req: Request, res: Response, next: NextFunction) {
        if (!this.authorized(req, res, next)) {
            this.sendError(req, res, next, this.notAuthorized);
        } else {
            next();
        }
    }

    constructor() {
        super();
    }
}
