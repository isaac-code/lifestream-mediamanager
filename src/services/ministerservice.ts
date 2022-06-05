import { BaseService } from "./baseservice";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { IMinisterModel } from "../models/minister";
import { NextFunction, Request, Response } from "express";
import { CreateMinisterDTO } from "../dto/input/createministerdto";
import { UpdateMinisterDTO } from "../dto/input/updateministerdto";
import { validateSync } from "class-validator";
import { trailNewRecord, handleException, list } from "../aspects/audittrailaspects";

export class MinisterService extends BaseService {

    @handleException()
    public async createMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {

        let dto = new CreateMinisterDTO(req.body.name, req.body.prettyName, req.body.image, req.body.ministry, req.body.coreType, req.body.office);

        let errors = await this.validateNewMinisterDetails(dto, req, tenantId);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }

        this.saveNewMinisterData(req, res, next, userId, tenantId, dto);
    }

    @trailNewRecord('minister')
    async saveNewMinisterData(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string, dto: any) {
        const { name, prettyName, image, ministry, coreType, office } = dto
        const secret = { name, image }

        let minister: IMinisterModel = req.app.locals.minister({
            secret, userId: userId, tenantId: tenantId, prettyName, nameHash: this.sha256(dto.name), ministry, coreType, office
        });

        return minister

    }

    hasErrors(errors) {
        return !(errors === undefined || errors.length == 0);
    }

    @list('minister')
    public async listMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {
        let variables = {
            tenant: false,
            sort: { createdAt: -1 }
        }
        return variables;
    }

    public async listOneMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {
        await req.app.locals.minister.findById(req.params.id).then(result => {
            if (result) {
                this.sendResponse(new BasicResponse(Status.SUCCESS, result), res);
            } else {
                this.sendResponse(new BasicResponse(Status.NOT_FOUND), res)
            }
        }).catch(err => {
            this.sendResponse(new BasicResponse(Status.ERROR), res)
        });
    }

    public async suspendMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {
        let existingMinister = null;
        await req.app.locals.minister.findById(req.params.id).then(result => {
            if (result) {
                existingMinister = result;
            } else {
                this.sendResponse(new BasicResponse(Status.NOT_FOUND), res)
            }
        }).catch(err => {
            this.sendResponse(new BasicResponse(Status.ERROR), res)
        });
        existingMinister.isActive = false;
        let responseObj = null;
        await existingMinister.save().then(result => {
            if (!result) {
                responseObj = new BasicResponse(Status.ERROR);
            } else {
                responseObj = new BasicResponse(Status.SUCCESS, result);
            }
        }).catch(err => {
            responseObj = new BasicResponse(Status.ERROR, err);
        });
        this.sendResponse(responseObj, res);
    }

    public async unSuspendMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {
        let existingMinister = null;
        await req.app.locals.minister.findById(req.params.id).then(result => {
            if (result) {
                existingMinister = result;
            } else {
                this.sendResponse(new BasicResponse(Status.NOT_FOUND), res)
            }
        }).catch(err => {
            this.sendResponse(new BasicResponse(Status.ERROR, err), res)
        });
        existingMinister.isActive = true;
        let responseObj = null;
        await existingMinister.save().then(result => {
            if (!result) {
                responseObj = new BasicResponse(Status.ERROR);
            } else {
                responseObj = new BasicResponse(Status.SUCCESS, result);
            }
        }).catch(err => {
            responseObj = new BasicResponse(Status.ERROR, err);
        });
        this.sendResponse(responseObj, res);
    }

    public async updateMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {
        try {
            const { name, image, ministry, coreType, office } = req.body
            let dto = new UpdateMinisterDTO(name, image, ministry, coreType, office);
            let existingMinister = null;
            await req.app.locals.minister.findById(req.params.id).then(result => {
                if (result) {
                    existingMinister = result;
                }
            });
            if (existingMinister.secret.name === dto.name) {
                await this.updateMinisterData(dto, userId, tenantId, req, res);
                return next();
            } else {
                let errors = await this.validateNewMinisterDetails(dto, req, tenantId);
                if (this.hasErrors(errors)) {
                    this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
                    return next();
                }
                await this.updateMinisterData(dto, userId, tenantId, req, res);
                return next();
            }
        } catch (ex) {
            this.sendException(ex, new BasicResponse(Status.ERROR, ex), req, res, next);
        }
    }

    public async deleteMinister(req: Request, res: Response, next: NextFunction, userId: string, tenantId: string) {
        req.app.locals.minister.findByIdAndRemove(req.params.id).then(result => {
            if (!result) {
                this.sendResponse(new BasicResponse(Status.ERROR), res);
            } else {
                this.sendResponse(new BasicResponse(Status.SUCCESS), res);
            }
        }).catch(err => {
            this.sendResponse(new BasicResponse(Status.ERROR, err), res);
        });
    }

    async updateMinisterData(dto: UpdateMinisterDTO, userId: string, tenantId: string, req: Request, res: Response) {
        let existingMinister = null;
        await req.app.locals.minister.findById(req.params.id).then(result => {
            if (result) {
                existingMinister = result;
            }
        }).catch(err => {
            this.sendResponse(new BasicResponse(Status.ERROR, err), res)
        });
        existingMinister.secret.name = dto.name;
        existingMinister.secret.image = dto.image;
        existingMinister.nameHash = this.sha256(dto.name);
        existingMinister.prettyName = dto.prettyName;
        dto.ministry ? existingMinister.ministry = dto.ministry : '';
        dto.coreType ? existingMinister.coreType = dto.coreType : '';
        dto.office ? existingMinister.office = dto.office : '';
        existingMinister.lastUpdatedAt = Date.now();
        let responseObj = null;
        await existingMinister.save().then(result => {
            if (!result) {
                responseObj = new BasicResponse(Status.ERROR);
            } else {
                responseObj = new BasicResponse(Status.SUCCESS, result);
            }
        }).catch(err => {
            responseObj = new BasicResponse(Status.ERROR, err);
        });
        this.sendResponse(responseObj, res);
    }

    async validateNewMinisterDetails(dto: CreateMinisterDTO, req: Request, tenantId: string) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }

        if (!dto.name) {
            errors.push(this.getRequiredError('Name', dto.name));
        } else {
            let foundname = await this.findMinisterWithName(req.app.locals.minister, dto.name);
            if (foundname > 0) {
                errors.push(this.getDuplicateError('Name', dto.name));
            }
        }

        if (dto.ministry) {
            let foundministry = await this.findValidMinistry(req.app.locals.ministry, dto.ministry);
            if (foundministry < 1) {
                errors.push(this.getInvalidDataError('Ministry', dto.ministry));
            }
        }
        return errors;
    }

    async findMinisterWithName(minister, name: string) {
        let found = 0;
        await minister.countDocuments({ 'nameHash': this.sha256(name) }).then(e => {
            found = e;
        });
        return found;
    }

    async findValidMinistry(ministry, id: string) {
        let found = 0;
        await ministry.findById(id).then(e => {
            found = e;
        }).catch(err => {

        });
        return found;
    }

}