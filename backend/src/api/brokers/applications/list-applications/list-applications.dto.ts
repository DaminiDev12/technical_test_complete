import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Application } from 'src/models/applications/application.entity';
import { ApplicationStatus } from 'src/enums/application-status.enum';
import { INVALID_MAXIMUM_DATE_ERROR, INVALID_MINIMUM_DATE_ERROR, MINIMUM_DATE_EXCEEDS_MAXIMUM_DATE_ERROR } from 'src/common/constants/response-messages';
import { IsArray, IsDate, IsEnum, IsOptional } from 'class-validator';
import { SuccessResponseDto } from 'src/common/responses';
import { TaskStatus } from 'src/enums/task-status.enum';
import { Transform, Type } from 'class-transformer';

/**
 * Querystring parameters for listing applications
 */
export class BrokerApplicationsListRequestDto {
  @ApiPropertyOptional({
    description: 'Optional flag for application status',
    enum: ApplicationStatus,
    enumName: 'ApplicationStatus',
  })
  @IsArray()
  @IsEnum(ApplicationStatus, { each: true })
  @IsOptional()
  readonly status?: ApplicationStatus[];

  @ApiPropertyOptional({
    description: 'Optional flag for applications with incomplete tasks',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  readonly completed?: TaskStatus.Completed | TaskStatus.Pending;

  @ApiPropertyOptional({
    description: 'Minimum date for the application submission',
  })
  @Transform(({ value }) => (value && !isNaN(new Date(value).getTime()) ? new Date(value) : null))
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly minimumDate?: Date;

  @ApiPropertyOptional({
    description: 'Maximum date for the application submission',
  })
  @Transform(({ value }) => (value && !isNaN(new Date(value).getTime()) ? new Date(value) : null))
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly maximumDate?: Date;
}

export class ApplicationDto extends PickType(Application, [
  'applicantName',
  'applicantEmail',
  'applicantMobilePhoneNumber',
  'applicantAddress',
  'annualIncomeBeforeTax',
  'incomingAddress',
  'incomingDeposit',
  'incomingPrice',
  'incomingStampDuty',
  'loanAmount',
  'loanDuration',
  'monthlyExpenses',
  'outgoingAddress',
  'outgoingMortgage',
  'outgoingValuation',
  'savingsContribution'
]) { }

export class BrokerApplicationPostResponseDto extends SuccessResponseDto {
  readonly loanAmount: number;
  readonly checkAmount : boolean;
}

class BrokerApplicationDto extends PickType(Application, [
  'id',
  'applicationId',
  'createdAt',
  'status',
  'loanAmount',
  'loanDuration',
  'applicantName',
  'incomingAddress',
  'outgoingAddress',
]) { }

export class BrokerApplicationsListResponseDto extends SuccessResponseDto {
  @ApiProperty({
    description: 'The broker\'s applications',
    type: [BrokerApplicationDto],
  })
  readonly applications: BrokerApplicationDto[];
}

const BAD_REQUEST_ERRORS = [
  INVALID_MINIMUM_DATE_ERROR,
  INVALID_MAXIMUM_DATE_ERROR,
  MINIMUM_DATE_EXCEEDS_MAXIMUM_DATE_ERROR,
];

export class BrokerApplicationsListBadRequestResponseDto {
  @ApiProperty({
    description: 'Failure message and reason',
    enum: BAD_REQUEST_ERRORS,
  })
  @IsEnum(BAD_REQUEST_ERRORS)
  readonly message: string;
}
