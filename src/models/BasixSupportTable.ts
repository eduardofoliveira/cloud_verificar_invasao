import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('basix_support_table')
class BasixSupportTable {
  @PrimaryColumn()
  name: string;

  @Column()
  value: string;
}

export default BasixSupportTable;
