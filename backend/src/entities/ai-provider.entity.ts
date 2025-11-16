import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AiModel } from './ai-model.entity';
import { UserProviderCredential } from './user-provider-credential.entity';

@Entity('ai_providers')
export class AiProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'docs_url', nullable: true })
  docsUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AiModel, (model) => model.provider)
  models: AiModel[];

  @OneToMany(() => UserProviderCredential, (credential) => credential.provider)
  userCredentials: UserProviderCredential[];
}
