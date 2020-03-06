// Type definitions for express-validation
/// <reference types="node" />
import { RequestHandler } from "express";
import { 
  ValidationOptions, 
  ValidationError as JoiError,
  Root as joiRoot, 
} from '@hapi/joi';

interface EvOptions {
  context?: boolean;
  keyByField?: boolean;
  statusCode?: number;
}

interface schema {
  params?: object;
  headers?: object;
  query?: object;
  cookies?: object;
  signedCookies?: object;
  body?: object;
}

interface errors {
  params?: JoiError[];
  headers?: JoiError[];
  query?: JoiError[];
  cookies?: JoiError[];
  signedCookies?: JoiError[];
  body?: JoiError[];
}

export declare const Joi: joiRoot;

export declare function validate(schema: schema, options?: EvOptions, joiRoot?: ValidationOptions): RequestHandler;

export class ValidationError {
  name: string;
  message: string;
  statusCode: number;
  error: string;
  details: errors;
}
