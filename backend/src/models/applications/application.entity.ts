import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from 'src/enums/application-status.enum';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Broker } from '../brokers/broker.entity';
import { Exclude } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsEmail } from 'class-validator';
import { Task } from '../tasks/task.entity';

/**
 * Data model for the applications table which holds
 * all of the loan application data
 */
@Table({
  tableName: 'applications',
  timestamps: true,
})
export class Application extends Model<Application> {
  /**
   * The primary key for the row
   */
  @ApiProperty({
    description: 'The primary key for the row',
  })
  @Exclude()
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  /**
   * A branded version of the id to distinguish between data types
   */
  @Column({
    type: DataType.VIRTUAL,
    get() {
      const id = this.getDataValue('id');
      return `A${id.toString().padStart(5, '0')}`;
    },
  })
  applicationId: string;

  /**
   * The applicant's name
   */
  @ApiProperty({ description: "The applicant's name" })
  @IsString()
  @Column({ type: DataType.STRING(50), field: 'applicant_name' })
  applicantName: string;

  /**
   * The applicant's email address
   */
  @ApiProperty({ description: "The applicant's email address" })
  @IsEmail()
  @Column({ type: DataType.STRING(255), field: 'applicant_email' })
  applicantEmail?: string;

  /**
   * The applicant's mobile phone number
   */
  @ApiProperty({ description: "The applicant's mobile phone number" })
  @IsString()
  @Column({
    type: DataType.STRING(20),
    unique: true,
    field: 'applicant_mobile_phone_number',
  })
  applicantMobilePhoneNumber: string;

  /**
   * The applicant's address
   */
  @ApiProperty({ description: "The applicant's address" })
  @IsString()
  @Column({ type: DataType.STRING(50), field: 'applicant_address' })
  applicantAddress: string;

  /**
   * The broker that arranged the loan
   */
  @ApiPropertyOptional({ description: 'The broker that arranged the loan' })
  @BelongsTo(() => Broker)
  broker?: Broker;

  /**
   * The broker id that arranged the loan
   */
  @ApiProperty({
    description: 'The broker that arranged the loan',
  })
  @ForeignKey(() => Broker)
  @Column({ type: DataType.INTEGER, field: 'broker_id' })
  @IsInt()
  @IsOptional()
  brokerId?: number;

  /**
   * The applicant's annual income before tax in dollars
   */
  @ApiProperty({ description: "The applicant's annual income before tax in dollars" })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'annual_income_before_tax',
  })
  annualIncomeBeforeTax: number;

  /**
   * The incoming property address
   */
  @ApiProperty({ description: 'The incoming property address' })
  @IsString()
  @Column({ type: DataType.STRING(50), field: 'incoming_address' })
  incomingAddress: string;

  /**
   * The deposit paid on the incoming property in dollars
   */
  @ApiProperty({ description: 'The deposit paid on the incoming property in dollars' })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'incoming_deposit',
  })
  incomingDeposit: number;

  /**
   * The purchase price of the incoming property in dollars
   */
  @ApiProperty({ description: 'The purchase price of the incoming property in dollars' })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'incoming_price',
  })
  incomingPrice: number;

  /**
   * The stamp duty to be paid on the incoming property in dollars
   */
  @ApiProperty({ description: 'The stamp duty to be paid on the incoming property in dollars' })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'incoming_stamp_duty',
  })
  incomingStampDuty: number;

  /**
   * The loan amount in dollars
   */
  @ApiProperty({ description: 'The loan amount in dollars' })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'loan_amount',
  })
  loanAmount: number;

  /**
   * The duration of the loan in months
   */
  @ApiProperty({ description: 'The duration of the loan in months' })
  @IsNumber()
  @Column({
    type: DataType.INTEGER,
    field: 'loan_duration',
  })
  loanDuration: number;

  /**
   * The applicant's monthly expenses in dollars
   */
  @ApiProperty({ description: "The applicant's monthly expenses in dollars" })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'monthly_expenses',
  })
  monthlyExpenses: number;

  /**
   * The outgoing property address
   */
  @ApiProperty({ description: 'The outgoing property address' })
  @IsString()
  @Column({ type: DataType.STRING(50), field: 'outgoing_address' })
  outgoingAddress: string;

  /**
   * The remaining mortgage if any on the outgoing property in dollars
   */
  @ApiProperty({ description: 'The remaining mortgage if any on the outgoing property in dollars' })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'outgoing_valuation',
  })
  outgoingMortgage: number;

  /**
   * The outgoing property valuation in dollars
   */
  @ApiProperty({ description: 'The outgoing property valuation in dollars' })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'outgoing_valuation',
  })
  outgoingValuation: number;

  /**
   * The applicant's savings put towards the loan in dollars
   */
  @ApiProperty({ description: "The applicant's savings put towards the loan in dollars" })
  @IsNumber()
  @Column({
    type: DataType.DECIMAL(10, 2),
    field: 'savings_contribution',
  })
  savingsContribution: number;

  /**
   * The application status in progress/on hold/etc
   */
  @ApiProperty({
    description: 'The application status in progress/on hold/etc',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
  })
  @Column({
    type: 'enum_application_status',
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  /**
   * The tasks attached to the loan
   */
  @ApiPropertyOptional({ description: 'The tasks attached to the loan' })
  @HasMany(() => Task, { onDelete: 'cascade', hooks: true })
  task?: Task;

  /**
   * The date the row was created
   */
  @ApiProperty({ description: 'The date the row was created', type: Date, format: 'date-time' })
  @Exclude()
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  @IsDate()
  createdAt: Date;

  /**
   * The date the row last modified
   */
  @ApiPropertyOptional({ description: 'The date the row was last modified', type: Date, format: 'date-time' })
  @Exclude()
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  static async getAverageLoanAmount(): Promise<number> {
    const result = await Application.findOne({
      attributes: [
        [this.sequelize.fn('AVG', this.sequelize.col('loan_amount')), 'averageLoanAmount']
      ],
    });
    const res = result?.get('averageLoanAmount') || 0;
    return res as number;
  }
}
