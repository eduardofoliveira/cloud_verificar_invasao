import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('basix_block_ignore_pattern')
class BasixBlockIgnorePattern {
  @PrimaryColumn({ primary: true, generated: 'increment' })
  id: number;

  @Column()
  callerid: string;

  @Column()
  callednum: string;
}

export default BasixBlockIgnorePattern;
