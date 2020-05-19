import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('trunks')
class Trunk {
  @PrimaryColumn({ primary: true, generated: 'increment' })
  id: number;

  @Column('int')
  status: number;
}

export default Trunk;
