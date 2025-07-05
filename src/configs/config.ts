import Joi from 'joi';

import 'dotenv/config'; 

const envValidation = Joi.object()
  .keys({
    PORT: Joi.number().default(3400),
    DB_NAME: Joi.string().required(),
    DB_HOST: Joi.string().default("localhost"),
    DB_USER: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
  })
  .unknown();

const { value: envVar, error } = envValidation
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = { 
    port: envVar.PORT,
    dbPort: envVar.DB_PORT,
    dbHost: envVar.DB_HOST,
    dbUser: envVar.DB_USER,
    dbPass: envVar.DB_PASSWORD,
    dbName: envVar.DB_NAME,
};
