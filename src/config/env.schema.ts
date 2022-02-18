import * as Joi from 'joi';

export const envVarsSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision', 'ci')
    .default('development'),
  PORT: Joi.number().default(3000),
  URL_PREFIX: Joi.string().default('v1/api'),
  TYPEORM_CONNECTION: Joi.string().valid('postgres').default('postgres'),
  TYPEORM_HOST: Joi.string().default('localhost'),
  TYPEORM_PORT: Joi.number().default(5432),
  TYPEORM_USERNAME: Joi.string().default('postgres'),
  TYPEORM_PASSWORD: Joi.string().allow('').allow(null),
  TYPEORM_DATABASE: Joi.string().default('postgres'),
});
