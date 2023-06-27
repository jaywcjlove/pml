import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn, CreateDateColumn } from 'typenexus';
// import { BeforeInsert, BeforeUpdate, AfterUpdate } from 'typenexus';
import { User } from './user.entity.js';
// import { encrypt } from '../utils/password.js';

@Entity()
export class Passwords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, comment: '标题' })
  title: string;

  @Column({ nullable: true, comment: 'URL' })
  url: string;

  @Column({ nullable: true, comment: '帐号' })
  username: string;

  @Column({
    nullable: true,
    comment: '密码',
  })
  password: string;

  @Column({ nullable: true, comment: '备注' })
  notes: string;

  /** 创建者 */
  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @DeleteDateColumn({ comment: '删除时间' })
  deleteAt: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  // @BeforeInsert()
  // @BeforeUpdate()
  // private async hashPassword() {
  //   console.log('::::21:', 'this.password')
  //   console.log('::::2:',this.password);
  //   // this.password = encrypt(this.password);
  //   this.password = this.password ? encrypt(this.password) : this.password;
  // }
}
