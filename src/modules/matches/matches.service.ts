import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { IResourceResponse, isMatchValid, transformApiDataToMatch } from '../../helpers/utils';
import { IMatchRepository, MatchRepository } from '../../repositories/match.repository';
import { ITeamRepository, TeamRepository } from '../../repositories/team.repository';
import { Match } from '../../models/match.model';
import { isArray } from 'class-validator';

export interface IMatchesService {
  refreshMatchesData(): Promise<void>;
  getMatches(teams: string[], dateFrom?: string, dateTo?: string): Promise<Match[]>;
  addMatch(match: Match): Promise<Match>;
  updateMatch(match: Match): Promise<Match>;
  updateMatch(match: Match): Promise<Match>;
  deleteMatchById(id: string): Promise<Match>;
}

@Injectable()
export class MatchesService implements IMatchesService {

  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly teamRepository: TeamRepository,
    private readonly httpService: HttpService,
  ) {}

  async refreshMatchesData(): Promise<void> {
    const response = await this.httpService.get<IResourceResponse[]>(process.env.MATCHES_API_URL);
    const data = (await response.toPromise()).data;
    if (!isArray(data)) {
      throw new Error();
    }
    await Promise.all(data.map(item => this.updateMatchesDataSet(transformApiDataToMatch(item))));
  }

  getMatches(teams: string[], dateFrom?: string, dateTo?: string): Promise<Match[]> {
    return this.matchRepository.getMatchesByParams(teams, dateFrom, dateTo);
  }

  addMatch(match: Match): Promise<Match> {
    return this.matchRepository.addMatch(match);
  }

  updateMatch(match: Match): Promise<Match> {
    return this.matchRepository.updateMatch(match);
  }

  deleteMatchById(id: string): Promise<Match> {
    return this.matchRepository.deleteById(id);
  }

  private async updateMatchesDataSet(data: Match): Promise<void> {
    if (!isMatchValid(data)) {
      return;
    }
    const match = await this.matchRepository.addMatch(data);
    await this.teamRepository.addMatchForTeam(data.guest, match._id)
    await this.teamRepository.addMatchForTeam(data.ownTeam, match._id)
  }

}
