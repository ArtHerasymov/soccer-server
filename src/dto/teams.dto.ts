import { IsNotEmpty } from 'class-validator';
import { Match } from '../models/match.model';

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
