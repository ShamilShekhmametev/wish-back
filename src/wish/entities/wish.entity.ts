import { Event } from '../../event/entities/event.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum WishPriority {
  Low = 'Низкий',
  Medium = 'Средний',
  High = 'Высокий',
  Dream = 'Мечта',
}

@Entity()
export class Wish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'wish' })
  name: string;

  @ManyToOne(() => Event)
  event: Event;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: false })
  reserved: boolean;

  @Column({ nullable: true })
  link: string;

  @Column({ default: 0 })
  price: number;

  @Column({ nullable: true, default: null })
  emoji: string;

  @Column({ type: 'enum', enum: WishPriority, default: WishPriority.Low })
  priority: WishPriority;
}
