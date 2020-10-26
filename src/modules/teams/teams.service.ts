import { Injectable } from '@nestjs/common';
import { ITeamRepository, TeamRepository } from '../../repositories/team.repository';
import { IMatchRepository, MatchRepository } from '../../repositories/match.repository';

export interface INewTeam {
  id?: string;
  title: string;
  matches: string[];
}

@Injectable()
export class TeamsService {

  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  searchTeamsByTitles(titles: string) {
    if (!titles) {
      return this.teamRepository.getAllTeams();
    }
    return this.teamRepository.getTeamsByTitles(titles);
  }

  getResults(title: string) {
    return this.teamRepository.getTeamResultsByTitle(title);
  }

  getRatio(title: string) {
    return this.teamRepository.getTeamRatio(title);
  }

  getRanks() {
    throw new Error();
    return this.teamRepository.getTeamsRanks();
  }

  async addTeam(team: INewTeam) {
    const existingMatches = await this.matchRepository.getMatchesByIds(team.matches);
    if (!existingMatches.length || existingMatches.length !== team.matches.length) {
      return;
    }
    return this.teamRepository.add(team);
  }

  async editTeam(team: INewTeam) {
    if (team.matches) {
      const existingMatches = await this.matchRepository.getMatchesByIds(team.matches);
      if (!existingMatches.length || existingMatches.length !== team.matches.length) {
        return;
      }
      team.matches = existingMatches.map(match => match._id);
    }
    return this.teamRepository.update(team);
  }

  deleteTeam(id: string) {
    return this.teamRepository.deleteById(id);
  }

  addMatchForTeam(title: string, id: string) {
    return this.teamRepository.addMatchForTeam(title, id);
  }

}
