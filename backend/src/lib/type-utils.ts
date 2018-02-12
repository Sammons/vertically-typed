import * as _ from "lodash";

// force { <key> : 'string' } inference
function Strictly<T extends { [x: string]: any }>(o: T): T;
function Strictly<T extends { [x: string]: any }, Y>(o: T, y: Y): T & Y;
function Strictly<T extends {}>(o: any, y?: any) {
  return Object.assign({}, o, y || {});
}

export { Strictly };

// strongly inferred { <key>: '<key>' }
export function StrEnum<V extends string>(...keys: V[]) {
  let s = {} as any;
  for (let k of keys) {
    s[k] = k;
  }
  return s as { [K in V]: K };
}

type Maybe<T> = T | void;
type Either<X, Y> = X | Y;

export function AtPath<T, A extends keyof T>(t: T, a: A): Maybe<T[A]>;
export function AtPath<T, A extends keyof T, B extends keyof T[A]>(
  t: T,
  a: A,
  b: B
): Maybe<T[A][B]>;
export function AtPath<
  T,
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B]
>(t: T, a: A, b: B, c: C): Maybe<T[A][B][C]>;
export function AtPath<
  T,
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B],
  D extends keyof T[A][B][C]
>(t: T, a: A, b: B, c: C, d: D): Maybe<T[A][B][C][D]>;
export function AtPath(o: any, ...keys: any[]) {
  let undef: void = void 0; //safely access undefined
  if (!o) {
    return undef;
  }
  for (let i of keys) {
    if (o[i]) {
      o = o[i];
    } else {
      return undef;
    }
  }
  return o;
}

export function IsGuid(text: string) {
  if (typeof text !== 'string') {
    return false;
  }
  return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    text
  );
}

// Diff<'A' | 'B', 'B' | 'C'> = 'A'
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

// Omit<{ a: number; b: number; }, 'b'> = { a: number }
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
export function Omit<T, V extends keyof T>(object: T, ...ommittions: V[]) {
  let clone = Object.assign({}, object);
  for (let key of ommittions) {
    delete clone[key];
  }
  return (clone as any) as Pick<T, Diff<keyof T, V>>;
}

// alias for keyof T
export type Keys<T> = keyof T;
export function Keys<T>(o: T) {
  if (!o) {
    return [];
  }
  return Object.keys(o) as Keys<T>[];
}

// flattens complex types that are hard to read
export type Simplify<T> = { [K in Keys<T>]: T[K] };

type EachOfTmp<T> = {
  [K in Keys<T>]: {
    _: { [X in K]: T[K] };
  }
};

// require only one of the keys
export type OneOf<T> = EachOfTmp<T>[Keys<T>]["_"] & Partial<T>;


// group array a map of <key>: values[], where they are grouped
// by a common key amongst the elements of the array
export function GroupByValue<O, T extends Keys<O>, V extends string>(
  o: O[] = [],
  k: T,
  v: V[] = []
) {
  const result: {[x: string]: any} = {};
  const values = [];
  o.forEach(element => {
    if (element[k] !== void 0 || v.includes(void 0)) {
      const curV = element[k] as any;
      if (v.includes(curV)) {
        if (!result[curV]) {
          result[curV] = [];
        }
        result[curV].push(element);
      }
    }
  });
  return result as { [K in V]: O[] };
}

// when you want to force the result of .map
// to be a particular type
export function MapStrict<
  O,
  S extends string,
  T extends {
    [key: string]: S;
  }
>(o: O[], f: (o: O, i: number) => T) {
  return o.map((o, i) => f(o, i));
}

