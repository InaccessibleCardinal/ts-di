import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  user_id: string;
  @Column()
  title: string;
  @Column()
  body: string;
}
