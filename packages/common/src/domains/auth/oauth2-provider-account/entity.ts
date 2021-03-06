/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../user";
import {OAuth2Provider} from "../oauth2-provider";

@Entity({name: 'oauth2_provider_accounts'})
@Index(['provider_id', 'user_id'], {unique: true})
export class Oauth2ProviderAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", nullable: true, default: null})
    access_token: string;

    @Column({type: "text", nullable: true, default: null})
    refresh_token: string;

    @Column({type: "varchar", length: 256})
    provider_user_id: string;

    @Column({type: "varchar", length: 256, nullable: true, default: null})
    provider_user_name: string;

    @Column({type: "varchar", length: 512, nullable: true, default: null})
    provider_user_email: string;

    @Column({type: "int", unsigned: true, nullable: true, default: null})
    expires_in: number;

    @Column({type: "timestamp", nullable: true, default: null})
    expires_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // -----------------------------------------------

    @Column({type: "int", unsigned: true})
    user_id: number;

    @ManyToOne(() => User, user => user.oauth2_provider_accounts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({type: "uuid"})
    provider_id: string;

    @ManyToOne(() => OAuth2Provider, provider => provider.accounts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'provider_id'})
    provider: OAuth2Provider;
}
