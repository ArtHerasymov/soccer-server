import { IsNotEmpty } from 'class-validator';

export class AddMatchDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  guest: string;

  @IsNotEmpty()
  guestGoals: number;

  @IsNotEmpty()
  ownTeam?: string;

  @IsNotEmpty()
  ownGoals: number;
}

export class UpdateMatchDto {
  @IsNotEmpty()
  id: string;

  date: Date;

  guest: string;

  guestGoals: number;

  ownTeam?: string;

  ownGoals: number;
}

export class DeleteMatchDto {
  @IsNotEmpty()
  id: string
}

export class GetMatchesDto {
  @IsNotEmpty()
  teams: string[];

  dateFrom: string;

  dateTo: string;
}
