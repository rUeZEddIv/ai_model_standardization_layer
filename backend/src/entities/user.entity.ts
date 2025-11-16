import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProviderCredential } from './user-provider-credential.entity';
import { GenerationJob } from './generation-job.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserProviderCredential, (credential) => credential.user)
  providerCredentials: UserProviderCredential[];

  @OneToMany(() => GenerationJob, (job) => job.user)
  generationJobs: GenerationJob[];
}
