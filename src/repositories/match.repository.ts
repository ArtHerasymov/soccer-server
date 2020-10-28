import { Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MATCH_SCHEMA_TYPE } from '../models/match.model';
import { Model } from 'mongoose';

export interface Match {
  _id?: string;
  date: Date | string,
  guest: string,
  guestGoals: number,
  ownTeam?: string;
  ownGoals: number,
}

export interface IMatchRepository {
  getMatchesByParams(teams: string[], dateFrom?: string, dateTo?: string): Promise<Match[]>;
  addMatch(match: Match): Promise<Match>;
  updateMatch(match: Match): Promise<Match>;
  deleteById(id: string): Promise<Match>;
  getMatchesByIds(ids: string[]): Promise<Match[]>;
}


@Injectable()
export class MatchRepository implements IMatchRepository {

  constructor(@InjectModel(MATCH_SCHEMA_TYPE) private readonly matchModel: Model<Match>) {}

  getMatchesByParams(teams: string[], dateFrom?: string, dateTo?: string): Promise<Match[]> {
    const query: any = { ownTeam: { $in: teams } };
    if (dateFrom && dateTo) {
      query.date = { $gt: new Date(dateFrom), $lt: new Date(dateTo) };
    }
    return this.matchModel.find(query);
  }

  getMatchesByIds(ids: string[]): Promise<Match[]> {
    return this.matchModel.find({ _id: { $in: ids } });
  }

  addMatch(match: Match): Promise<Match> {
    return this.matchModel.create(match);
  }

  updateMatch(match: Match): Promise<Match> {
    return this.matchModel.findOneAndUpdate({ _id: match._id }, match, { new: true, });
  }

  deleteById(id: string): Promise<Match> {
    return this.matchModel.deleteOne({ _id: id });
  }

}
