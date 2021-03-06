/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {buildQuery, BuildInput} from "@trapi/query";
import {
    APIType,
    CollectionResourceResponse,
    SingleResourceResponse,
    useAPI
} from "../../../modules";
import {UserRole} from "./entity";

export async function getApiUserRoles(data: BuildInput<UserRole>) : Promise<CollectionResourceResponse<UserRole>> {
    const response = await useAPI(APIType.DEFAULT).get('user-roles' + buildQuery(data));

    return response.data;
}

export async function getApiUserRole(id: typeof UserRole.prototype.id) : Promise<SingleResourceResponse<UserRole>>  {
    const response = await useAPI(APIType.DEFAULT).get('user-roles/' + id);

    return response.data;
}

export async function dropAPIUserRole(id: typeof UserRole.prototype.id) : Promise<SingleResourceResponse<UserRole>>  {
    let response = await useAPI(APIType.DEFAULT).delete('user-roles/' + id);

    return response.data;
}

export async function addAPIUserRole(data: Partial<UserRole>) : Promise<SingleResourceResponse<UserRole>>  {
    const response = await useAPI(APIType.DEFAULT).post('user-roles', data);

    return response.data;
}
