// Type definitions for express-validation
// Project: https://github.com/andrewkeig/express-validation/issues
// Definitions by: Fabian Gutierrez <https://github.com/fega>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
/// <reference types="node" />
import { RequestHandler } from "express";
import * as Joi from "joi";
import {
  Root as joi,
  ValidationOptions,
  ValidationError,
  ValidationResult,
} from '@hapi/joi';


interface ValidatorField {
  [key: string]: any;
}

interface Validator {
  body?: ValidatorField;
  params?: ValidatorField;
  query?: ValidatorField;
  headers?: ValidatorField;
  cookies?: ValidatorField;
  signedCookies?: ValidatorField;
}

interface EvOptions {
  context?: boolean;
}

declare function validate(validator: Validator, options?: EvOptions, joiOptions?: ValidationOptions): RequestHandler;

declare namespace validate {
  export class ValidationError {
    name: string;
    message: "validation error";
    errors: ValidationError[];
    statusCode: number;
    error: string;
  }
}

export = validate;
