import Joi from 'joi';

export const DEFAULT_JOI_OPTIONS: Joi.ValidationOptions = {
    abortEarly: false, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: true, // remove unknown props
    convert: false, // remove unknown props
    debug: false,
};
