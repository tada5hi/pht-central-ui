/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {User} from "../user";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity, JoinColumn, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Service} from "../../service";
import {ClientType} from "./type";
import {createAuthClientSecret} from "./utils";

@Entity({name: 'auth_clients'})
export class Client {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 100})
    secret: string;

    @Column({type: "varchar", length: 255})
    name: string;

    @Column({type: "text", nullable: true})
    description: string;

    @Column({type: "enum", enum: ClientType})
    type: ClientType;

    // ------------------------------------------------------------------

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    // ------------------------------------------------------------------

    @Column({nullable: true})
    service_id: string | null;

    @OneToOne(() => Service, service => service.client, {nullable: true})
    @JoinColumn({name: 'service_id'})
    service: Service | null;

    @Column({type: "int", length: 11, nullable: true})
    user_id: number | null;

    @OneToOne(() => Client, {onDelete: "CASCADE"})
    @JoinColumn({name: 'user_id'})
    user: User | null;

    // ------------------------------------------------------------------

    @BeforeInsert()
    createSecret() {
        if (typeof this.secret === 'undefined') {
            this.secret = createAuthClientSecret();
        }
    }

    refreshSecret() {
        this.secret = createAuthClientSecret();
    }
}
