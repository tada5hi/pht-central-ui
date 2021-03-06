/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {config} from "dotenv";
import path from "path";

const envResult = config({
    path: path.resolve(__dirname, '../.env')
});

if (envResult.error) {
    console.error('[ERROR] env failed to load:' + envResult.error);
}

export function requireFromEnv(key : string, alt?: any) {
    if (!process.env[key] && typeof alt === 'undefined') {
        console.error('[APP ERROR] Missing env variable:'+key)

        return process.exit(1)
    }

    return process.env[key] ?? alt;
}

export interface Environment {
    env: string,
    port: number,
    swaggerDocumentation: boolean | null

    jwtMaxAge: number,

    rabbitMqConnectionString: string,
    harborConnectionString: string,
    vaultConnectionString: string,

    apiUrl: string,
    internalApiUrl: string,
    webAppUrl: string,

    demo: boolean
}

// tslint:disable-next-line:radix
const jwtMaxAge : number = parseInt(requireFromEnv('JWT_MAX_AGE', '3600'));

const env : Environment = {
    env: requireFromEnv('NODE_ENV'),
    port: parseInt(requireFromEnv('PORT'), 10),
    swaggerDocumentation: requireFromEnv('SWAGGER_DOCUMENTATION', 'false') !== 'false',

    jwtMaxAge: Number.isNaN(jwtMaxAge) ? 3600 : jwtMaxAge,

    rabbitMqConnectionString: requireFromEnv('RABBITMQ_CONNECTION_STRING'),
    harborConnectionString: requireFromEnv('HARBOR_CONNECTION_STRING'),
    vaultConnectionString: requireFromEnv('VAULT_CONNECTION_STRING'),

    apiUrl: requireFromEnv('API_URL'),
    internalApiUrl: requireFromEnv('INTERNAL_API_URL', requireFromEnv('API_URL')),
    webAppUrl: requireFromEnv('WEB_APP_URL'),

    demo: requireFromEnv('DEMO', 'false') !== 'false'
};

export default env;
