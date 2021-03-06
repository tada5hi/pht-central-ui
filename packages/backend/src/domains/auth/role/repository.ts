/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {EntityRepository, In, Repository} from "typeorm";
import {OwnedPermission} from "@typescript-auth/core";
import {RolePermission} from "@personalhealthtrain/ui-common";
import {Role} from "@personalhealthtrain/ui-common";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
    async getOwnedPermissions(
        roleId: number | number[]
    ) : Promise<OwnedPermission<unknown>[]> {
        if(!Array.isArray(roleId)) {
            roleId = [roleId];
        }

        if(roleId.length === 0) {
            return [];
        }

        const repository = this.manager.getRepository(RolePermission);

        const entities = await repository.find({
            role_id: In(roleId)
        });

        const result : OwnedPermission<unknown>[] = [];
        for(let i=0; i<entities.length; i++) {
            result.push({
                id: entities[i].permission_id,
                condition: entities[i].condition,
                power: entities[i].power,
                fields: entities[i].fields,
                negation: entities[i].negation
            })
        }

        return result;
    }
}
