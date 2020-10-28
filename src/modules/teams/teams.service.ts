import { Injectable } from '@nestjs/common';
import { IRanks, ITeamRatio, ITeamResults, TeamRepository } from '../../repositories/team.repository';
import { MatchRepository } from '../../repositories/match.repository';
import { Team } from '../../models/teams.model';

export interface INewTeam {
  id?: string;
  title: string;
  matches: string[];
}

export interface ITeamsService {
  searchTeamsByTitles(titles: string): Promise<Team[]>;
  getResults(title: string): Promise<ITeamResults>;
  getRatio(title: string): Promise<ITeamRatio>;
  getRanks(): Promise<IRanks>;
  addTeam(team: INewTeam): Promise<Team>;
  editTeam(team: INewTeam): Promise<Team>;
  deleteTeam(id: string): Promise<Team>;
  addMatchForTeam(title: string, id: string): Promise<Team>;
  checkMatchesExist(matchIds: string[]): Promise<boolean>;
}

@Injectable()
export class TeamsService implements ITeamsService {

  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  searchTeamsByTitles(titles: string): Promise<Team[]> {
    if (!titles) {
      return this.teamRepository.getAllTeams();
    }
    return this.teamRepository.getTeamsByTitles(titles);
  }

  getResults(title: string): Promise<ITeamResults> {
    return this.teamRepository.getTeamResultsByTitle(title);
  }

  getRatio(title: string): Promise<ITeamRatio> {
    return this.teamRepository.getTeamRatio(title);
  }

  getRanks(): Promise<IRanks> {
    return this.teamRepository.getTeamsRanks();
  }

  async addTeam(team: INewTeam): Promise<Team> {
    return this.teamRepository.add(team);
  }

  async editTeam(team: INewTeam): Promise<Team> {
    const existingMatches = await this.matchRepository.getMatchesByIds(team.matches);
    team.matches = existingMatches.map(match => match._id);
    return this.teamRepository.update(team);
  }

  deleteTeam(id: string): Promise<Team> {
    return this.teamRepository.deleteById(id);
  }

  async checkMatchesExist(matchIds: string[]) {
    const existingMatches = await this.matchRepository.getMatchesByIds(matchIds);
    if (!existingMatches.length || existingMatches.length !== matchIds.length) {
      return false;
    }
    return true;
  }

  addMatchForTeam(title: string, id: string): Promise<Team> {
    return this.teamRepository.addMatchForTeam(title, id);
  }

}
