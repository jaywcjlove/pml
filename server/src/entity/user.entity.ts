import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn } from 'typenexus';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '邮箱账号' })
  email: string;

  @Column({ select: false, comment: '密码' })
  password: string;

  @Column({ nullable: true, comment: '姓名' })
  name: string;

  @Column({ nullable: true, default: false, comment: '是否为管理员' })
  isAdmin: boolean;

  @DeleteDateColumn({ comment: '删除时间' })
  deleteAt: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;
}
