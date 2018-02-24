// Type definitions for express-validation
// Project: https://github.com/andrewkeig/express-validation/issues
// Definitions by: Fabian Gutierrez <https://github.com/fega>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
/// <reference types="node" />
import { RequestHandler } from "express";
import * as Joi from "joi";
interface ValidatorField {
  [key: string]: any;
}
interface Validator {
  body?: ValidatorField;
  params?: ValidatorField;
  query?: ValidatorField;
  headers?: ValidatorField;
  cookies?: ValidatorField;
  options?: {
    allowUnknownBody?: boolean;
    allowUnknownHeaders?: boolean;
    allowUnknownQuery?: boolean;
    allowUnknownParams?: boolean;
    allowUnknownCookies?: boolean
  };
}

declare function validate(validator: Validator): RequestHandler;
declare namespace validate {
  export class ValidationError {
    errors: Messages[];
    status: number;
    statusText: string;
    message: "validation error";

  }
  interface Messages {
    message: string;
    types: string;
  }
}

export = validate;
