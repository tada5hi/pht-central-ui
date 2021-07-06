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
import {Role} from "../../role";
import {User} from "../index";

@Entity({name: 'user_roles'})
@Index(['role_id', 'user_id'], {unique: true})
export class UserRole {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", unsigned: true})
    user_id: number;

    @Column({type: "int", unsigned: true})
    role_id: number;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    @ManyToOne(() => Role, role => role.user_roles, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'role_id'})
    role: Role;

    @ManyToOne(() => User, user => user.user_roles, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'user_id'})
    user: User;
}