/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {APIType, useAPI} from "../../../../modules";

export type HarborProject = {
    name: string,
    id: number
}

export async function findHarborProject(id: string | number, isProjectName: boolean = false) : Promise<HarborProject> {
    const headers : Record<string, any> = {};

    if(isProjectName) {
        headers['X-Is-Resource-Name'] = true;
    }

    try {
        const {data} = await useAPI(APIType.HARBOR)
            .get('projects/' + id);

        return {
            name: data.name,
            id: data.project_id
        };
    } catch (e) {
        if(e.response.status === 404) {
            return undefined;
        }

        throw e;
    }
}

export async function ensureHarborProject(name: string) {
    try {
        await useAPI(APIType.HARBOR)
            .post('projects', {
                project_name: name,
                public: true
            });

        return await findHarborProject(name, true);
    } catch (e) {
        if(e.response.status === 409) {
            return await findHarborProject(name, true);
        }

        throw e;
    }
}

export async function deleteHarborProject(id: string | number, isProjectName: boolean = false) {
    const headers : Record<string, any> = {};

    if(isProjectName) {
        headers['X-Is-Resource-Name'] = true;
    }

    await useAPI(APIType.HARBOR)
        .delete('projects/' + id, headers);
}
