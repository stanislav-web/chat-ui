/**
 * API Response statuses
 */

type Success = 200;
type Created = 201;
type NoContent = 204;
type BadRequest = 400;
type Unauthorized = 401;
type Forbidden = 403;
type NotFound = 404;
type MethodNotAllowed = 405;
type NotAcceptable = 406;
type InternalServerError = 500;
type ServiceUnavailable = 503;

export type SuccessStatusType = Success | Created | NoContent;
export type FailedStatusType = BadRequest | Unauthorized | Forbidden | NotFound | MethodNotAllowed | NotAcceptable;
export type ExceptionStatusType = InternalServerError | ServiceUnavailable;
