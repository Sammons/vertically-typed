import { Request } from "./request-wrapper";
import * as express from "express";
import * as _ from 'lodash';
import { Diff } from "../type-utils";

export class Response<Payload> {
  constructor(private res: express.Response, public request: Request<any, any>, private validator?: any) {
    res.setHeader("x-request-id", request.contextId);
  }

  get error() {
    return {
      unhandled: (e: Error) => {
        return this.res.status(500).json({
          error: { message: 'Server Error' }
        });
      },
      unauthorized: () => {
        return this.res.status(401).json({
          error: { message: 'Unauthorized' }
        });
      },
      notfound: () => {
        return this.res.status(404).json({
          error: { message: 'NotFound' }
        });
      },
      missingParams: (params: string[]) => {
        return this.res.status(403).json({
          error: { message: 'MissingParams', params }
        });
      },
      invalid: (msg: string) => {
        return this.res.status(403).json({
          error: { message: 'InvalidParams: ' + msg }
        });
      }
    };
  }

  redirect(toPath: string) {
    this.res.redirect(toPath); 
    return this.res;
  }
  _setValidator(v: any) {
    this.validator = v;
  }
  end(status: number = 200) {
    return this.res.status(status).send();
  }
  test(o: number) {
    
  }
  json(o: Payload) {
    if (this.validator) {
      const error = this.validator(o);
      if (error) {
        return error as Error as express.Response | Error
      }
    }
    return this.res.status(200).json(o) as express.Response | Error
  }

  paramsAreMissing(...params: string[]) {
    const missingParams = [];
    const body = this.request.body
    for (let param of params) {
      if (this.request.params[param] === undefined && body[param] === undefined) {
        missingParams.push(param);
      }
    }
    if (_.isEmpty(missingParams)) {
      return false;
    }
    this.error.missingParams(missingParams);
    return true;
  }
}
