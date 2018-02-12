export type Prop = {
  pattern?: string;
  example?: string;
  description?: string;
  required?: boolean;
  type: "number" | "string" | "array" | "object";
  items?: string;
};
export type StringOrNumberProp<T extends "string" | "number"> = Prop & {
  type: T;
};
export type Func1<P, T> = (p: P) => T;

export class Builder<CurrentShape extends {}> {
  private def = ({ type: "object" } as any) as {
    [K: string]: any;
  };
  public shape: CurrentShape = {} as CurrentShape;
  constructor() {}

  string<S extends string>(
    key: S,
    opts: StringOrNumberProp<"string"> = { type: "string" }
  ) {
    opts.type = "string";
    opts.required = true;
    this.def[key as any] = opts;
    return (this as any) as Builder<CurrentShape & { [K in S]: string }>;
  }

  number<S extends string>(
    key: S,
    opts: StringOrNumberProp<"number"> = { type: "number" }
  ) {
    opts.type = "number";
    opts.required = true;
    this.def[key as any] = opts;
    return (this as any) as Builder<CurrentShape & { [K in S]: number }>;
  }

  array<S extends string>(key: S, opts: Prop = { type: "array" }) {
    opts["type"] = "array";
    const self = this;
    return {
      ofStrings() {
        opts["items"] = "string";
        opts.required = true;
        self.def[key as any] = opts;
        return (self as any) as Builder<CurrentShape & { [K in S]: string[] }>;
      },
      ofNumbers() {
        opts["items"] = "number";
        opts.required = true;
        self.def[key as any] = opts;
        return (self as any) as Builder<CurrentShape & { [K in S]: number[] }>;
      },
      of<R extends { shape: any }>(builder: Func1<Builder<{}>, R>) {
        let res = builder(new Builder<{}>());
        opts["items"] = (res as any)["def"];
        opts.required = true;
        self.def[key as any] = opts;
        return (self as any) as Builder<
          CurrentShape & { [K in S]: (R["shape"])[] }
        >;
      }
    };
  }

  object<S extends string, R extends { shape: any }>(
    key: S,
    // opts: Prop = { type: "object" },
    builder: Func1<Builder<{}>, R>
  ) {
    let res = builder(new Builder<{}>());
    this.def[key as any] = (res as any)["def"];
    this.def[key as any].required = true;
    return (this as any) as Builder<
      CurrentShape & { [K in S]: typeof res["shape"] }
    >;
  }
}
