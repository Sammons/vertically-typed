// trivial log implementation using console.log
// definitely replace console with winston/morgan/bunyan or something
// for the purpose of this sample, logging has been trivialized
// in order to simplify code. Add it as necessary for your application

// access logging via context.makeLog()

import { StrEnum } from "./type-utils";
import * as moment from "moment";
export const LogLevels = StrEnum("info", "debug", "warn", "error");
const LogLevelsKeys = Object.keys(LogLevels);

export type LogLevels = keyof typeof LogLevels;
export type Logger = {
  [K in LogLevels]: <T>(message: string, meta: T) => void
};

// create logger function with given level
function logLevel(level: string, pins: string[]) {
  return (message: string, meta: any) =>
    console.log(level, moment.utc(), ...pins, message, meta);
}

/**
 *
 * @param pins - things logged in every line
 */
export function Make(pins: string[]): Logger {
  const result = {} as any;
  LogLevelsKeys.forEach(key => {
    result[key] = logLevel(key, pins);
  });
  return result;
}
