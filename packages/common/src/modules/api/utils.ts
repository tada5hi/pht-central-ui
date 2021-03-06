/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    API_CONFIG_DEFAULT_KEY,
    APIConfig, APIConfigType, APIType,
    getAPIConfig
} from "./config";
import {BaseAPI} from "./module";
import {HarborAPI, VaultAPI} from "./service";

const instanceMap: Map<string, BaseAPI> = new Map<string, BaseAPI>();

export type APIReturnType<T extends APIConfigType> =
    T extends APIType.HARBOR ? HarborAPI :
        T extends APIType.VAULT ? VaultAPI :
            BaseAPI;

export function useAPI<T extends APIType>(
    key?: string,
) : APIReturnType<T> {
    key ??= API_CONFIG_DEFAULT_KEY;

    const config : APIConfig<T> = getAPIConfig(key);

    if(instanceMap.has(config.type)) {
        return instanceMap.get(config.type) as APIReturnType<T>;
    }

    let instance : BaseAPI;

    switch (config.type) {
        case 'harbor':
            instance = new HarborAPI(config as APIConfig<APIType.HARBOR>);
            break;
        case 'vault':
            instance = new VaultAPI(config as APIConfig<APIType.VAULT>);
            break;
        default:
            instance = new BaseAPI(config.driver);
            break;
    }

    instanceMap.set(config.type, instance);

    return instance as APIReturnType<T>;
}

export function mapOnAllAPIs(callback: CallableFunction) {
    const iterator = instanceMap.keys();

    let value = iterator.next();

    while (!value.done) {
        const instance = useAPI(value.value);
        callback(instance);

        value = iterator.next();
    }
}
