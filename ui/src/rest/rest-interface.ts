// ingests the rest-definition
// to make it usable in a typesafe manner.
// it is probably best to wrap usages of this
// because using it directly is pretty ugly

import * as _ from "lodash";
import * as superagent from "superagent";
import { definition } from "./rest-definition";
type Keys<T> = keyof T;
function Keys<T>(o: T): Keys<T>[] {
  return (Object.keys(o) as any) as Keys<T>[];
}

export class RestInterface {
  constructor(private opts: { host: string; origin?: string; headers: {} }) {}

  _proc = <T, S extends keyof typeof definition>(def: T, verb: S) => {
    const verbDef = definition[verb];
    const endpoints: (keyof typeof definition[S])[] = Keys(verbDef);
    const o = {} as {
      [E in typeof endpoints[0]]: (
        params?: typeof verbDef[E]["shape"]["params"],
        body?: typeof verbDef[E]["shape"]["body"]
      ) => {
        req: superagent.Request;
        value: Promise<typeof verbDef[E]["shape"]["payload"]>;
      }
    };
    for (let e of endpoints) {
      o[e] = this.toRequester(
        verb as any,
        _.get(verbDef, `${e}.uri`),
        _.get(verbDef, `${e}.definition.params`),
        _.get(verbDef, `${e}.definition.body`)
      ) as any;
    }
    return o;
  };

  get = (() => {
    const getDefs = definition.get;
    const endpoints: (keyof typeof definition["get"])[] = Keys(getDefs);
    const o = {} as {
      [E in typeof endpoints[0]]: (
        params?: typeof getDefs[E]["shape"]["params"]
      ) => {
        req: superagent.Request;
        value: Promise<typeof getDefs[E]["shape"]["payload"]>;
      }
    };
    for (let e of endpoints) {
      o[e] = this.toRequester(
        "get",
        _.get(getDefs, `${e}.uri`),
        _.get(getDefs, `${e}.definition.params`),
        _.get(getDefs, `${e}.definition.body`)
      ) as any;
    }
    return o;
  })();
  // delete = (() => {
  //   const delDefs = definition.delete;
  //   const endpoints: (keyof typeof definition['delete'])[] = Keys(delDefs);
  //   const o = {} as { [E in typeof endpoints[0]]: (params?: typeof delDefs[E]['shape']['params']) => { req: superagent.Request, value: Promise<typeof delDefs[E]['shape']['payload']> } };
  //   for (let e of endpoints) {
  //     o[e] = this.toRequester('delete', _.get(delDefs, `${e}.uri`), _.get(delDefs, `${e}.definition.params`), _.get(delDefs, `${e}.definition.body`)) as any;
  //   }
  //   return o;
  // })();

  post = this._proc(definition, "post");
  put = this._proc(definition, "put");
  patch = this._proc(definition, "patch");

  private isInvalid(body: any, bodyDef: any) {
    if (!bodyDef) {
      return false;
    }
    if (!body && bodyDef) {
      return `No body`;
    }
    for (let bodyKey in _.keys(bodyDef)) {
      if (bodyKey === "type") {
        continue;
      }
      const value = body[bodyKey];
      const def = bodyDef[bodyKey] as
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
      let res = this.isInvalidValue(value, def);
      if (res) {
        return `Invalid key ${bodyKey}. ${res}`;
      }
    }
    return false;
  }

  isInvalidValue(value: any, def: any): any {
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
          let result = this.isInvalidValue(v, def.items);
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
        const result = this.isInvalidValue(value[key], def[key]);
        if (result) {
          return `Object key ${key} is invalid. ${result}`;
        }
      }
      return false;
    }
    return `Unknown definition`;
  }

  toRequester<Params, Body, Payload>(
    method: "get" | "post" | "put" | "delete",
    uri: string,
    paramsDef?: any,
    bodyDef?: any
  ) {
    if (!uri) {
      throw new Error("");
    }
    return (params?: Params, body?: Body) => {
      const errRet = (e: Error) => ({
        req: null as void,
        value: Promise.reject(e)
      });
      // validate params
      if (paramsDef && _.keys(paramsDef).length > 0) {
        if (!params) {
          return errRet(new Error("need params object"));
        }
        for (let paramKey in _.keys(paramsDef)) {
          const def = paramsDef[paramKey];
          const value = (params as any)[paramKey];
          if (!def) {
            continue;
          }
          if (def.required) {
            if (_.isNil(value)) {
              return errRet(
                new Error(`Request invalid, missing param ${paramKey}`)
              );
            }
          }
          if (def.pattern) {
            if (new RegExp(def.pattern).test(value)) {
              return errRet(
                new Error(
                  `Request invalid, invalid pattern in param ${paramKey}`
                )
              );
            }
          }
        }
      }

      const uriParams = uri.match(/(:\w+)/g) || [];
      uriParams.forEach(uriParam => {
        uri = uri.replace(uriParam, (params as any)[uriParam.substr(1)]);
      });

      // validate body
      if (bodyDef) {
        if (!body) {
          return errRet(new Error("Request invalid, missing body"));
        }
        const error = this.isInvalid(body, bodyDef);
        if (error) {
          return errRet(new Error(error));
        }
      }

      let req = superagent[method](this.opts.host + uri);
      if (method === "get") {
        req.retry(2);
      }
      if (this.opts.headers) {
        _.keys(this.opts.headers).forEach(h => {
          req.set(h, (this as any).opts.headers[h]);
        });
      }
      if (this.opts.origin) {
        req.set("origin", this.opts.origin);
      }
      if (body) {
        req.send(body);
      }
      if (params) {
        req.query(params);
      }
      return {
        req,
        value: req.then(v => v.body as Payload)
      };
    };
  }
}
