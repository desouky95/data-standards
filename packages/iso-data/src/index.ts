import {
  CallingCode,
  FifaCode,
  OlympicCode,
  QueryArgs,
  callingCodes,
  capitals,
  fifaCodes,
  iocCodes,
} from "@desoukysvyc/data-collector";
import * as _ from "lodash";

var _callingCodes = callingCodes as any as Array<CallingCode>;

var _fifaCodes = fifaCodes as any as Array<{
  country: string;
  federation: string;
  code: FifaCode;
}>;

var _iocCodes = iocCodes as any as Array<{
  country: string;
  code: OlympicCode;
}>;

var _capitals = capitals as any as Array<{
  country: string;
  capital: string;
}>;

Array.prototype.query = function <T>(this: Array<T>, args: QueryArgs<T>) {
  return _.filter(this, args);
};

export {
  _callingCodes as callingCodes,
  _fifaCodes as fifaCodes,
  _iocCodes as iocCodes,
  _capitals as capitals,
};
