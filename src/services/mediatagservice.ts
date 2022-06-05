import { BaseService } from "./baseservice";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { IMediaTagModel } from "../models/mediatag";
import { NextFunction, Request, Response } from "express";
import { CreateMediaTagDTO } from "../dto/input/createmediatagdto";
import { UpdateMediaTagDTO } from "../dto/input/updatemediatagdto";
import { validateSync } from "class-validator";
import {
    trailNewRecord,
    handleException,
    list,
    listOne,
    suspend,
    unsuspend,
    feature,
    unfeature,
    remove
} from "../aspects/audittrailaspects";

export class MediaTagService extends BaseService {
    @handleException()
    public async createMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let dto = new CreateMediaTagDTO(
            req.body.name,
            req.body.prettyName,
            req.body.image,
            req.body.coreType
        );

        let errors = await this.validateNewMediaTagDetails(dto, req, tenantId);
        if (this.hasErrors(errors)) {
            this.sendResponse(
                new BasicResponse(Status.FAILED_VALIDATION, errors),
                res
            );
            return next();
        }

        this.saveNewMediaTagData(req, res, next, userId, tenantId, dto);
    }

    @trailNewRecord("mediaTag")
    async saveNewMediaTagData(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string,
        dto: any
    ) {
        const { name, prettyName, image, coreType } = dto;
        const secret = { name, image };

        let mediatag: IMediaTagModel = req.app.locals.mediatag({
            secret,
            userId: userId,
            tenantId: tenantId,
            nameHash: this.sha256(dto.name),
            prettyName,
            coreType
        });

        return mediatag;
    }

    hasErrors(errors) {
        return !(errors === undefined || errors.length == 0);
    }

    @list("mediaTag")
    public async listMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @listOne("mediaTag")
    public async listOneMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @suspend("mediaTag")
    public async suspendMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @unsuspend("mediaTag")
    public async unSuspendMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @feature("mediaTag")
    public async featureMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @unfeature("mediaTag")
    public async unFeatureMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        };
        return variables;
    }

    @remove("mediaTag")
    public async deleteMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) { }

    public async updateMediaTag(
        req: Request,
        res: Response,
        next: NextFunction,
        userId: string,
        tenantId: string
    ) {
        try {
            const { name, prettyName, image, coreType } = req.body;
            let dto = new UpdateMediaTagDTO(name, prettyName, image, coreType);
            let existingMediaTag = null;
            await req.app.locals.mediatag.findById(req.params.id).then(result => {
                if (result) {
                    existingMediaTag = result;
                }
            });
            await this.updateMediaTagData(dto, userId, tenantId, req, res);
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

    async updateMediaTagData(
        dto: UpdateMediaTagDTO,
        userId: string,
        tenantId: string,
        req: Request,
        res: Response
    ) {
        let existingMediaTag = null;
        await req.app.locals.mediatag
            .findById(req.params.id)
            .then(result => {
                if (result) {
                    existingMediaTag = result;
                }
            })
            .catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), res);
            });
        dto.name ? (existingMediaTag.secret.name = dto.name) : "";
        dto.prettyName ? (existingMediaTag.prettyName = dto.prettyName) : "";
        dto.image ? (existingMediaTag.secret.image = dto.image) : "";
        dto.name ? (existingMediaTag.nameHash = this.sha256(dto.name)) : "";
        dto.coreType ? (existingMediaTag.coreType = dto.coreType) : "";
        existingMediaTag.lastUpdatedAt = Date.now();
        let responseObj = null;
        await existingMediaTag
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
        this.sendResponse(responseObj, res);
    }

    async validateNewMediaTagDetails(
        dto: CreateMediaTagDTO,
        req: Request,
        tenantId: string
    ) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }

        if (!dto.name) {
            errors.push(this.getRequiredError("Name", dto.name));
        } else {
            let foundname = await this.findMediaTagWithName(
                req.app.locals.mediatag,
                dto.name
            );
            if (foundname > 0) {
                errors.push(this.getDuplicateError("Name", dto.name));
            }
        }

        return errors;
    }

    async findMediaTagWithName(mediatag, name: string) {
        let found = 0;
        await mediatag.countDocuments({ nameHash: this.sha256(name) }).then(e => {
            found = e;
        });
        return found;
    }
}
