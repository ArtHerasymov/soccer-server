import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { transformApiDataToMatch } from '../../helpers/utils';
import { IMatchRepository, MatchRepository } from '../../repositories/match.repository';
import { ITeamRepository, TeamRepository } from '../../repositories/team.repository';
import { Match } from '../../models/match.model';
import { isArray } from 'class-validator';

export interface IResourceResponse {
  AwayTeam: string;
  HomeTeam: string;
  Date: string;
  FTHG: string;
  FTAG: string;
}

@Injectable()
export class MatchesService {

  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly teamRepository: TeamRepository,
    private readonly httpService: HttpService,
  ) {}

  async refreshMatchesData() {
    const response = await this.httpService.get<IResourceResponse>(process.env.MATCHES_API_URL);
    const data: any = (await response.toPromise()).data;
    if (!isArray(data)) {
      throw new Error();
    }
    return Promise.all(data.map(item => this.updateMatchesDataSet(transformApiDataToMatch(item))));
  }

  getMatches(teams: string[], dateFrom?: string, dateTo?: string): Promise<Match[]> {
    return this.matchRepository.getMatchesByParams(teams, dateFrom, dateTo);
  }

  addMatch(match: Match) {
    return this.matchRepository.addMatch(match);
  }

  updateMatch(match: Match) {
    return this.matchRepository.updateMatch(match);
  }

  deleteMatchById(id: string) {
    return this.matchRepository.deleteById(id);
  }


  private async updateMatchesDataSet(data: Match) {
    const match = await this.matchRepository.addMatch(data);
    await this.teamRepository.addMatchForTeam(data.guest, match._id)
    await this.teamRepository.addMatchForTeam(data.ownTeam, match._id)
  }

}
