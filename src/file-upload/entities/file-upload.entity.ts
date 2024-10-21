import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('csv_files')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  title: string;
  @Column()
  file: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedDate: Date;
}
