import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'event' })
  name: string;

  @Column({ nullable: true })
  date: Date;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true, default: null })
  emoji: string;
}
