import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'air_reports' })
export class AirReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 3, nullable: false })
  aqi: number;

  @Column({ type: 'int', width: 2, nullable: false })
  day: number;

  @Column({
    type: 'enum',
    enum: [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ],
    nullable: false,
  })
  month: string;

  @Column({ type: 'int', width: 4, nullable: false })
  year: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  savedDate: Date;
}
