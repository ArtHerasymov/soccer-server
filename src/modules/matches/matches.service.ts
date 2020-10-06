import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import fetch from 'node-fetch';
import { TeamsService } from '../teams/teams.service';
import { transformApiDataToMatch } from '../../helpers/utils';
import { Match } from '../../models/match.model';

@Injectable()
export class MatchesService {

  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly teamsService: TeamsService,
  ) {}

  async refreshMatchesData() {
    const response = await fetch('https://api.jsonbin.io/b/5ebb0cf58284f36af7ba1779/1');
    const data = await response.json();

    data.forEach(data => {
      this.updateMatchesDataSet(transformApiDataToMatch(data)).catch();
    });
  }

  async getMatches(teams: string[], dateFrom?: string, dateTo?: string) {
    const query: any = { ownTeam: { $in: teams } };
    if (dateFrom && dateTo) {
      query.date = { $gt: new Date(dateFrom), $lt: new Date(dateTo) };
    }
    return this.matchModel.find(query);
  }

  async addMatch(match: Match) {
    const newMatch = new this.matchModel(match);
    return newMatch.save();
  }

  async updateMatch(data: Match) {
    return this.matchModel.findOneAndUpdate({ _id: data.id }, data, { new: true, });
  }

  async deleteMatchById(id: string) {
    return this.matchModel.deleteOne({ _id: id });
  }


  private async updateMatchesDataSet(data: Match) {
    const newMatch = new this.matchModel(data);
    newMatch.save();
    this.teamsService.updateMatchForTeam(data.guest, newMatch._id);
    this.teamsService.updateMatchForTeam(data.ownTeam, newMatch._id);
  }

}
