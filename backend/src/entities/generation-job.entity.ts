import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { AiModel } from './ai-model.entity';
import { JobStatus } from '../enums';
import { GeneratedOutput } from './generated-output.entity';

@Entity('generation_jobs')
export class GenerationJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'model_id' })
  modelId: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PENDING,
  })
  status: JobStatus;

  @Column({ type: 'jsonb', name: 'input_payload' })
  inputPayload: any;

  @Column({ type: 'jsonb', name: 'output_payload', nullable: true })
  outputPayload: any;

  @Column({ name: 'provider_job_id', nullable: true })
  providerJobId: string;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.generationJobs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => AiModel, (model) => model.generationJobs)
  @JoinColumn({ name: 'model_id' })
  model: AiModel;

  @OneToMany(() => GeneratedOutput, (output) => output.job)
  outputs: GeneratedOutput[];
}
