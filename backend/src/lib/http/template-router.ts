import { Request } from "./request-wrapper";
import { Response } from "./response-wrapper";
import * as express from "express";
import * as _ from "lodash";
import { Builder } from "./shape-builder";

type Prop = {
  pattern?: string;
  example?: string;
  description?: string;
  required?: boolean;
  type: "number" | "string" | "array" | "object";
};
type StringOrNumberProp<T extends "string" | "number"> = Prop & { type: T };
type Func1<P, T> = (p: P) => T;
type HandlerResult = express.Response | Error
type Handler<Request, Response> = (
  req: Request,
  res: Response
) => Promise<HandlerResult> | HandlerResult;

type AddKeys<T extends {}, Keys extends string, V> = T & { [K in Keys]: V };
type AddOptionalKeys<T, Keys extends string, V> = T & { [K in Keys]?: V };


class Endpoint<
  TRouteString extends string,
  QueryShape extends {[key: string]: any},
  BodyShape extends {[key: string]: any},
  PayloadShape extends {[key: string]: any}
> {
  private params = {} as QueryShape;
  constructor() {}
  private bodyDef: any = null;
  private payloadDef: any = null;
  private handler: any = null;

  withParam<K extends string>(
    key: K,
    o: Prop = { required: true, type: "string" }
  ): Endpoint<
    TRouteString,
    AddKeys<QueryShape, K, string>,
    BodyShape,
    PayloadShape
  > {
    this.params[key as any] = o;
    return this as any;
  }

  withOptionalParam<K extends string>(
    key: K,
    o: Prop = { required: false, type: "string" }
  ) {
    this.params[key as any] = o;
    return (this as any) as Endpoint<
      TRouteString,
      AddOptionalKeys<QueryShape, K, string>,
      BodyShape,
      PayloadShape
    >;
  }

  withBody<Res extends { shape: any }>(
    builder: Func1<Builder<{}>, Res>
  ) {
    const body = builder(new Builder());
    this.bodyDef = body;
    return (this as any) as Endpoint<
      TRouteString,
      QueryShape,
      Res["shape"],
      PayloadShape
    >;
  }

  withResponse<Res extends { shape: any }>(
    builder: Func1<Builder<{}>, Res>
  ) {
    const pay = builder(new Builder());
    this.payloadDef = pay;
    return (this as any) as Endpoint<
      TRouteString,
      QueryShape,
      BodyShape,
      Res['shape']
    >;
  }

  withHandler(
    f: Handler<Request<BodyShape, QueryShape>, Response<PayloadShape>>
  ): void {
    this.handler = f;
    return void 0;
  }
  
  toHandler<
    Params extends {[key: string]: any},
    Body extends {[key: string]: any},
    Payload extends {[key: string]: any}
   >(opts: {} = {}) {
    return async (req: express.Request, res: express.Response) => {
      const request = new Request<Body, Params>(req);
      const response = new Response<Payload>(res, request);

      // validate params
      for (let paramKey of _.keys(this.params)) {
        const def: Prop = this.params[paramKey];
        const value = request.params[paramKey];
        if (def.required) {
          if (_.isNil(value)) {
            return response.error.missingParams([paramKey]);
          }
        }
        if (def.pattern) {
          if (new RegExp(def.pattern).test(value)) {
            return response.error.missingParams([paramKey]);
          }
        }
      }

      const isInvalidValue = (value: any, def: any) => {
        if (!def) {
          return false;
        }
        if (def.required && value === void 0) {
          return `Required.`;
        }
        if (def.type === "number") {
          return false; // todo support more options
        }
        if (def.type === "string") {
          if (def.pattern) {
            if (!new RegExp(def.pattern)) {
              return `Does not match pattern ${def.pattern}.`;
            }
          }
        }
        if (def.type === "array") {
          if (Array.isArray(value)) {
            for (let v in value) {
              let result = isInvalid(v, def.items);
              if (result) {
                return `Array Element Invalid. ${result}`;
              }
            }
            return false;
          } else {
            return `Is not an array.`;
          }
        }
        if (def.type === "object") {
          if (typeof value !== "object") {
            return `Is not an object`;
          }
          if (value === null) {
            return false; // technically null exists
          }
          const keys = _.keys(value);
          for (let key in keys) {
            if (key === "type") {
              continue;
            }
            const result = isInvalid(value[key], def[key]);
            if (result) {
              return `Object key ${key} is invalid. ${result}`;
            }
          }
          return false;
        }
        return `Unknown definition`;
      };

      const isInvalid = (obj: any, def: any): boolean | string => {
        if (!def) {
          return false;
        }
        if (!obj && def) {
          return `No body`;
        }
        for (let bodyKey in _.keys(this.bodyDef)) {
          if (bodyKey === "type") {
            continue;
          }
          const value = request.body[bodyKey];
          const def = this.bodyDef[bodyKey] as
            | {
                type: "number";
                required: boolean;
              }
            | {
                type: "string";
                required: boolean;
                pattern: string;
              }
            | {
                type: "array";
                items: "number" | "string" | {};
                required: boolean;
              }
            | {
                type: "object";
                required: boolean;
              };
          let res = isInvalidValue(value, def);
          if (res) {
            return `Invalid key ${bodyKey}. ${res}`;
          }
        }
        return false;
      };

      // validate body
      const error = isInvalid(request.body, this.bodyDef);
      if (typeof error === 'string') {
        return response.error.invalid(error);
      }

      // refuse payload because it is shaped wrong
      response._setValidator((payload: any) => {
        return isInvalid(payload, this.payloadDef);
      });

      try {
        return (await this.handler(request, response)) as express.Response;
      } catch (e) {
        return response.error.unhandled(e);
      }
    };
  }
}
type Verbs = "post" | "put" | "get" | "delete" | "patch";
export class TemplateRouter {
  router = express();
  routes: {
    verb: Verbs;
    route: string;
    endpoint: Endpoint<any, any, any, any>;
  }[] = [];
  constructor(public opts: {} = {}, public middlewares: any[] = []) {}

  private add(def: { verb: Verbs, route: string, endpoint: Endpoint<any, any, any, any> }) {
    this.routes.push(def);
    this.router[def.verb](def.route, def.endpoint.toHandler(this.opts));
  }

  postToRoute<R extends string>(route: R) {
    const endpoint = new Endpoint<R, {}, {}, {}>();
    this.add({ verb: "post", route, endpoint });
    return endpoint;
  }

  getFromRoute<R extends string>(route: R) {
    const endpoint = new Endpoint<R, {}, {}, {}>();
    this.add({ verb: "get", route, endpoint });
    return endpoint;
  }

  delAtRoute<R extends string>(route: R) {
    const endpoint = new Endpoint<R, {}, {}, {}>();
    this.add({ verb: "delete", route, endpoint });
    return endpoint;
  }

  putAtRoute<R extends string>(route: R) {
    const endpoint = new Endpoint<R, {}, {}, {}>();
    this.add({ verb: "put", route, endpoint });
    return endpoint;
  }

  patchAtRoute<R extends string>(route: R) {
    const endpoint = new Endpoint<R, {}, {}, {}>();
    this.add({ verb: "patch", route, endpoint });
    return endpoint;
  }
}
