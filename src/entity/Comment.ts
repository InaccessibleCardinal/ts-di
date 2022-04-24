import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  article_id: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  body: string;
}
