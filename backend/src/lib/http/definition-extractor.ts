import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import { SampleRouter, SampleTemplateRouter } from "../../routes/sample";

const definition = {};

function genFakeShape(def: any): any {
  if (!def) {
    return void 0;
  }
  if (def.type === "number") {
    return 1;
  }
  if (def.type === "string") {
    return "";
  }
  if (def.type === "array") {
    return [genFakeShape(def.items)];
  }
  if (def.type === "object" || !def.type) {
    const keys = Object.keys(def);
    const obj: { [key: string]: any } = {};
    for (let key of keys) {
      if (key === "type") {
        continue;
      }
      obj[key] = genFakeShape(def[key]);
    }
    return obj;
  }
}

function transformEndpoint(str: string) {
  return str.replace(/\//g, "_").replace(/\:/gm, "$");
}

["get", "post", "put", "patch", "delete"].forEach(v => {
  _.set(definition, v, {});
});

SampleTemplateRouter.routes.forEach((route: any) => {
  const extraParams = (route.route.match(/(:\w+)/g) || []).map((e: string) =>
    e.replace(":", "")
  );
  for (let param of extraParams) {
    _.set(route, `endpoint.paramsDef.${param}`, { type: "string" });
  }
  if (_.includes(["get", "delete"], route.verb)) {
    _.set(definition, `${route.verb}.${transformEndpoint(route.route)}`, {
      uri: route.route,
      shape: {
        params: genFakeShape(_.get(route, "endpoint.paramsDef", {})),
        payload: genFakeShape(_.get(route, "endpoint.payloadDef.def", {}))
      },
      definition: {
        params: _.get(route, "endpoint.paramsDef", {}),
        payload: _.get(route, "endpoint.payloadDef.def", null)
      }
    });
  } else {
    _.set(definition, `${route.verb}.${transformEndpoint(route.route)}`, {
      uri: route.route,
      shape: {
        params: genFakeShape(_.get(route, "endpoint.paramsDef", {})),
        payload: genFakeShape(_.get(route, "endpoint.payloadDef.def", {})),
        body: genFakeShape(_.get(route, "endpoint.bodyDef.def", null))
      },
      definition: {
        params: _.get(route, "endpoint.paramsDef", {}),
        payload: _.get(route, "endpoint.payloadDef.def", null),
        body: _.get(route, "endpoint.bodyDef.def", null)
      }
    });
  }
});

fs.writeFileSync(
  "rest-definition.ts",
  `export const definition = ${JSON.stringify(definition, null, 2).replace(
    /\:\ null/gm,
    ": null as void"
  )}`
);

console.log("done");
process.exit(0);
