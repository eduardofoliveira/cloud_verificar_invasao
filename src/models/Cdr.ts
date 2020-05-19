import { Entity, Column, PrimaryColumn } from 'typeorm';

export enum CallDirection {
  OUTBOUND = 'outbound',
  INBOUND = 'inbound',
}

export enum CallType {
  STANDARD = 'STANDARD',
  DID = 'DID',
  FREE = 'FREE',
  CALLINGCARD = 'CALLINGCARD',
}

@Entity('cdrs')
class Cdr {
  @PrimaryColumn()
  uniqueid: string;

  @Column('int')
  accountid: number;

  @Column('tinyint')
  type: number;

  @Column()
  callerid: string;

  @Column()
  callednum: string;

  @Column('smallint')
  billseconds: number;

  @Column('smallint')
  trunk_id: number;

  @Column()
  trunkip: string;

  @Column()
  callerip: string;

  @Column()
  disposition: string;

  @Column({ type: 'datetime', nullable: true })
  callstart: Date;

  @Column('decimal')
  debit: number;

  @Column('decimal')
  cost: number;

  @Column('int')
  provider_id: number;

  @Column('smallint')
  pricelist_id: number;

  @Column('int')
  package_id: number;

  @Column()
  pattern: string;

  @Column()
  notes: string;

  @Column('int')
  invoiceid: number;

  @Column('decimal')
  rate_cost: number;

  @Column('int')
  reseller_id: number;

  @Column()
  reseller_code: string;

  @Column()
  reseller_code_destination: string;

  @Column('decimal')
  reseller_cost: number;

  @Column()
  provider_code: string;

  @Column()
  provider_code_destination: string;

  @Column('decimal')
  provider_cost: number;

  @Column('decimal')
  provider_call_cost: number;

  @Column({
    type: 'enum',
    enum: CallDirection,
  })
  call_direction: CallDirection;

  @Column({
    type: 'enum',
    enum: CallType,
    default: CallType.STANDARD,
  })
  calltype: CallType;

  @Column({ type: 'datetime', nullable: true })
  profile_start_stamp: Date;

  @Column({ type: 'datetime', nullable: true })
  answer_stamp: Date;

  @Column({ type: 'datetime', nullable: true })
  bridge_stamp: Date;

  @Column({ type: 'datetime', nullable: true })
  progress_stamp: Date;

  @Column({ type: 'datetime', nullable: true })
  progress_media_stamp: Date;

  @Column({ type: 'datetime', nullable: true })
  end_stamp: Date;

  @Column('int')
  billmsec: number;

  @Column('int')
  answermsec: number;

  @Column('int')
  waitmsec: number;

  @Column('int')
  progress_mediamsec: number;

  @Column('int')
  flow_billmsec: number;

  @Column('tinyint')
  is_recording: number;

  @Column('tinyint')
  call_request: number;
}

export default Cdr;
