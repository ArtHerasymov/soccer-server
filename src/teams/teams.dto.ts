import { IsNotEmpty } from 'class-validator';
import { Match } from '../matches/match.model';

export class AddTeamDto {
  @IsNotEmpty()
  title: string;

  matches: Array<string>;
}

export class EditTeamDto {
  @IsNotEmpty()
  id: string;

  title: string;

  matches: Array<Match>;
}

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
  teams: string;

  dateFrom: string;

  dateTo: string;
}

export class GetTeamsDto {
  titles: string
}

export class GetResultsDto {
  @IsNotEmpty()
  team: string;
}

export class GetRatioDto {
  @IsNotEmpty()
  team: string;
}

export class DeleteTeamDto {
  @IsNotEmpty()
  id: string;
}
