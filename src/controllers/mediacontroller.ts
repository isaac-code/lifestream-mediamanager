import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./basecontroller";
import { MediaService } from "../services/mediaservice";
import { MediaTagService } from "../services/mediatagservice";

export class MediaController extends BaseController {
    public loadRoutes(prefix: String, router: Router) {
        this.createMedia(prefix, router);
        this.listMedia(prefix, router);
        this.searchMedia(prefix, router);
        this.media(prefix, router);
        this.updateMedia(prefix, router);
        this.suspendMedia(prefix, router);
        this.unSuspendMedia(prefix, router);
        this.deleteMedia(prefix, router);
        this.deleteTotalMedia(prefix, router);

        this.createMediaTag(prefix, router);
        this.listMediaTag(prefix, router);
        this.mediaTag(prefix, router);
        this.updateMediaTag(prefix, router);
        this.suspendMediaTag(prefix, router);
        this.unSuspendMediaTag(prefix, router);
        this.featureMediaTag(prefix, router);
        this.unFeatureMediaTag(prefix, router);
        this.deleteMediaTag(prefix, router);
    }

    //Media

    public createMedia(prefix: String, router: Router): any {
        router.post(
            prefix + "/",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().createMedia(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public listMedia(prefix: String, router: Router): any {
        router.get(
            prefix + "/",
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().listMedia(req, res, next);
            }
        );
    }

    public searchMedia(prefix: String, router: Router): any {
        router.post(
            prefix + "/search/result",
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().searchMedia(req, res, next);
            }
        );
    }

    public media(prefix: String, router: Router): any {
        router.get(
            prefix + "/:id",
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().listOneMedia(req, res, next);
            }
        );
    }

    public updateMedia(prefix: String, router: Router): any {
        router.put(
            prefix + "/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().updateMedia(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public suspendMedia(prefix: String, router: Router): any {
        router.put(
            prefix + "/suspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().suspendMedia(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public unSuspendMedia(prefix: String, router: Router): any {
        router.put(
            prefix + "/unsuspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().unSuspendMedia(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public deleteMedia(prefix: String, router: Router): any {
        router.delete(
            prefix + "/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().deleteMedia(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public deleteTotalMedia(prefix: String, router: Router): any {
        router.delete(
            prefix + "/total/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaService().deleteTotalMedia(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    //Media Tag

    public createMediaTag(prefix: String, router: Router): any {
        router.post(
            prefix + "/data/tag",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().createMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public listMediaTag(prefix: String, router: Router): any {
        router.get(
            prefix + "/data/tag",
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().listMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public mediaTag(prefix: String, router: Router): any {
        router.get(
            prefix + "/data/tag/:id",
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().listOneMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public updateMediaTag(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/tag/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().updateMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public suspendMediaTag(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/tag/suspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().suspendMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public unSuspendMediaTag(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/tag/unsuspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().unSuspendMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public featureMediaTag(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/tag/feature/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().featureMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public unFeatureMediaTag(prefix: String, router: Router): any {
        router.put(
            prefix + "/data/tag/unfeature/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().unFeatureMediaTag(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public deleteMediaTag(prefix: String, router: Router): any {
        router.delete(
            prefix + "/data/tag/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MediaTagService().deleteMediaTag(
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
