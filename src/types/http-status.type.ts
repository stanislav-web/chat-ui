/**
 * API Success type
 * @type {number}
 * @const
 */
type Success = 200;

/**
 * API Created type
 * @type {number}
 * @const
 */
type Created = 201;

/**
 * API NoContent type
 * @type {number}
 * @const
 */
type NoContent = 204;

/**
 * API BadRequest type
 * @type {number}
 * @const
 */
type BadRequest = 400;

/**
 * API Unauthorized type
 * @type {number}
 * @const
 */
type Unauthorized = 401;

/**
 * API Forbidden type
 * @type {number}
 * @const
 */
type Forbidden = 403;

/**
 * API NotFound type
 * @type {number}
 * @const
 */
type NotFound = 404;

/**
 * API MethodNotAllowed type
 * @type {number}
 * @const
 */
type MethodNotAllowed = 405;

/**
 * API NotAcceptable type
 * @type {number}
 * @const
 */
type NotAcceptable = 406;

/**
 * API InternalServerError type
 * @type {number}
 * @const
 */
type InternalServerError = 500;

/**
 * API ServiceUnavailable type
 * @type {number}
 * @const
 */
type ServiceUnavailable = 503;

/**
 * API SuccessStatusType type
 * @type {Success|Created|NoContent}
 * @const
 */
type SuccessStatusType = Success | Created | NoContent;

/**
 * API SuccessStatusType type
 * @type {BadRequest|Unauthorized|Forbidden|NotFound|MethodNotAllowed|NotAcceptable}
 * @const
 */
type FailedStatusType = BadRequest | Unauthorized | Forbidden | NotFound | MethodNotAllowed | NotAcceptable;

/**
 * API ExceptionStatusType type
 * @type {InternalServerError|ServiceUnavailable}
 * @const
 */
type ExceptionStatusType = InternalServerError | ServiceUnavailable;

export type {
  SuccessStatusType,
  FailedStatusType,
  ExceptionStatusType
}
