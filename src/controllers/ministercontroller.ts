import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./basecontroller";
import { MinisterService } from "../services/ministerservice";
export class MinisterController extends BaseController {
    public loadRoutes(prefix: String, router: Router) {
        this.createMinister(prefix, router);
        this.listMinister(prefix, router);
        this.minister(prefix, router);
        this.updateMinister(prefix, router);
        this.suspendMinister(prefix, router);
        this.unSuspendMinister(prefix, router);
        this.deleteMinister(prefix, router);
    }

    public createMinister(prefix: String, router: Router): any {
        router.post(
            prefix + "/",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().createMinister(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public listMinister(prefix: String, router: Router): any {
        router.get(
            prefix + "/",
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().listMinister(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public minister(prefix: String, router: Router): any {
        router.get(
            prefix + "/:id",
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().listOneMinister(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public updateMinister(prefix: String, router: Router): any {
        router.put(
            prefix + "/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().updateMinister(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public suspendMinister(prefix: String, router: Router): any {
        router.put(
            prefix + "/suspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().suspendMinister(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public unSuspendMinister(prefix: String, router: Router): any {
        router.put(
            prefix + "/unsuspend/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().unSuspendMinister(
                    req,
                    res,
                    next,
                    this.user_id,
                    this.user_tenantId
                );
            }
        );
    }

    public deleteMinister(prefix: String, router: Router): any {
        router.delete(
            prefix + "/:id",
            [this.authorize.bind(this)],
            (req: Request, res: Response, next: NextFunction) => {
                new MinisterService().deleteMinister(
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
