import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { GenerationJob } from './generation-job.entity';
import { OutputType } from '../enums';

@Entity('generated_outputs')
export class GeneratedOutput {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @Column({
    type: 'enum',
    enum: OutputType,
  })
  type: OutputType;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'text', name: 'text_content', nullable: true })
  textContent: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => GenerationJob, (job) => job.outputs)
  @JoinColumn({ name: 'job_id' })
  job: GenerationJob;
}
