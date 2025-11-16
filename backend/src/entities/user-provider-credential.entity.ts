import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AiProvider } from './ai-provider.entity';

@Entity('user_provider_credentials')
export class UserProviderCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'provider_id' })
  providerId: string;

  @Column({ name: 'api_key' })
  apiKey: string; // Should be encrypted in production

  @Column({ nullable: true })
  nickname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.providerCredentials)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => AiProvider, (provider) => provider.userCredentials)
  @JoinColumn({ name: 'provider_id' })
  provider: AiProvider;
}
