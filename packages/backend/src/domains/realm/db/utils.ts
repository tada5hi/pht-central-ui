import {Brackets, SelectQueryBuilder} from "typeorm";
import {MASTER_REALM_ID} from "../index";

export function onlyRealmPermittedQueryResources<T>(query: SelectQueryBuilder<T>, realm: string, queryField: string | string[] = 'realm_id') {
    if(realm === MASTER_REALM_ID) return;

    return query.andWhere(new Brackets(qb => {
        if(Array.isArray(queryField)) {

            for(let i=0; i<queryField.length; i++) {
                qb.orWhere(queryField[i]+' = :realm'+i, {['realm'+i]: realm});
            }
        } else {
            qb.where(queryField+' = :realm', {realm});
        }
    }));
}

