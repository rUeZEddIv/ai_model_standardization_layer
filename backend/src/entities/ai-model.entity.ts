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
import { AiProvider } from './ai-provider.entity';
import { GenerationCategory } from '../enums';
import { GenerationJob } from './generation-job.entity';

@Entity('ai_models')
export class AiModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  @Column()
  name: string;

  @Column({ name: 'model_identifier' })
  modelIdentifier: string;

  @Column({
    type: 'enum',
    enum: GenerationCategory,
    name: 'generation_category',
  })
  generationCategory: GenerationCategory;

  @Column({ name: 'api_endpoint_url' })
  apiEndpointUrl: string;

  @Column({ name: 'webhook_callback_url', nullable: true })
  webhookCallbackUrl: string;

  @Column({ type: 'jsonb' })
  capabilities: any;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => AiProvider, (provider) => provider.models)
  @JoinColumn({ name: 'provider_id' })
  provider: AiProvider;

  @OneToMany(() => GenerationJob, (job) => job.model)
  generationJobs: GenerationJob[];
}
