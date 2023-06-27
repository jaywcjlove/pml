import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn } from 'typenexus';
import { Tree, TreeChildren, TreeParent } from 'typenexus';
import { User } from './user.entity.js';

/** 密码类别 */
@Entity()
@Tree('materialized-path')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  /** 类别名称 */
  @Column({ unique: true, comment: '类别名称' })
  name: string;

  /** 类别子类别 */
  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  /** 创建者 */
  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @DeleteDateColumn({ comment: '删除时间' })
  deleteAt: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;
}
