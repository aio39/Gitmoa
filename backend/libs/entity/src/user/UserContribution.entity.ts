import { EntityName } from '@lib/entity/EntityName';
import { User } from '@lib/entity/user/User.entity';
import { InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

export enum ContributionType {
  Commit = 'commit',
  PullRequest = 'pull_request',
  Issue = 'issue',
}

@InputType(`${EntityName.UserContribution}Input`, { isAbstract: true })
@Entity({ name: EntityName.UserContribution })
@ObjectType()
export class UserContribution {
  @PrimaryColumn()
  id: string;

  @Column('datetime')
  date: string;

  @Index()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'fk_user_id' })
  User?: User | null;

  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType.Commit,
  })
  type!: ContributionType;

  @Index()
  @Column()
  repoName: string;
}
