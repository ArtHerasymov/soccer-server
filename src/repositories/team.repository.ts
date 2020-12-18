import { Match } from './match.repository';
import { Injectable } from '@nestjs/common';
import { INewTeam } from '../modules/teams/teams.service';
import { InjectModel } from '@nestjs/mongoose';
import { TEAM_SCHEMA_TYPE } from '../models/teams.model';
import { Model } from 'mongoose';

export interface Team {
  id?: string;
  title?: string;
  matches: Match[];
}

export interface ITeamResults {
  totalVictories: number;
  totalLosses: number;
  totalDraws: number;
  totalGoals: number;
  totalMissed: number;
}

export interface ITeamRatio {
  ratio: number;
}

export interface IRanks {
  title: string;
  points: number;
}

export interface IMatchesQuery {
  matches?: string[];
}

export interface ITeamRepository {
  add(team: INewTeam): Promise<Team>;
  update(team: INewTeam): Promise<Team>;
  getTeamsByTitles(titles: string): Promise<Team[]>;
  getAllTeams(): Promise<Team[]>;
  getTeamResultsByTitle(title: string): Promise<ITeamResults>;
  getTeamRatio(title: string): Promise<ITeamRatio>;
  getTeamsRanks(): Promise<IRanks>;
  deleteById(id: string): Promise<Team>;
  addMatchForTeam(title: string, matchId: string): Promise<Team>;
}

@Injectable()
export class TeamRepository implements ITeamRepository {

  constructor(
    @InjectModel(TEAM_SCHEMA_TYPE) private readonly teamModel: Model<Team>,
  ) {}

  getTeamsByTitles(titles: string): Promise<Team[]> {
    return this.teamModel.find({ title: { $in: titles } }).populate('matches');
  }

  getAllTeams(): Promise<Team[]> {
    return this.teamModel.find().populate('matches');
  }

  getTeamResultsByTitle(title: string): Promise<ITeamResults> {
    return this.teamModel.aggregate([
      { $match: { title } },
      { $lookup: { from: 'matches', localField: 'matches', foreignField: '_id', as: 'matches' } },
      { $project: { _id: 0,
          totalVictories: { $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $gte: [{$subtract: ['$$match.ownGoals', '$$match.guestGoals']}, 0]  }, then: 1, else: 0 } } } } }},
          totalLosses: { $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $gte: [{$subtract: ['$$match.guestGoals', '$$match.ownGoals']}, 0]  }, then: 1, else: 0 } } } } }},
          totalDraws: { $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $eq: [{$subtract: ['$$match.guestGoals', '$$match.ownGoals']}, 0]  }, then: 1, else: 0 } } } } }},
          totalGoals: { $sum: '$matches.ownGoals' },
          totalMissed: { $sum: '$matches.guestGoals' }
        }
      },
    ]);
  }

  getTeamRatio(title: string): Promise<ITeamRatio> {
    return this.teamModel.aggregate([
      { $match: { title } },
      { $lookup: { from: 'matches', localField: 'matches', foreignField: '_id', as: 'matches' } },
      {
        $project: {
          _id: 0,
          ratio: { $divide:[
              { $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $gte: [{$subtract: ['$$match.ownGoals', '$$match.guestGoals']}, 0]  }, then: 1, else: 0 } } } } }},
              { $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $gte: [{$subtract: ['$$match.guestGoals', '$$match.ownGoals']}, 0]  }, then: 1, else: 0 } } } } }}
            ]}
        }
      }
    ]);
  }

  getTeamsRanks(): Promise<IRanks> {
    return this.teamModel.aggregate([
      { $lookup: { from: 'matches', localField: 'matches', foreignField: '_id', as: 'matches' } },
      {
        $project: {
          _id: 0,
          title: '$title',
          points: { $sum: [{
              $multiply : [{
                $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $gte: [{$subtract: ['$$match.ownGoals', '$$match.guestGoals']}, 0]  }, then: 1, else: 0 } } } } }
              }, 3] }, { $sum : {$map : { input: '$matches', as: 'match', in: { $add: { $cond: { if: { $eq: [{$subtract: ['$$match.guestGoals', '$$match.ownGoals']}, 0]  }, then: 1, else: 0 } } } } }} ]  },
        },
      },
      {
        $sort: {
          points: -1
        }
      }
    ])
  }

  add(team: INewTeam): Promise<Team> {
    return this.teamModel.findOneAndUpdate(team, { upsert: true });
  }

  deleteById(id: string): Promise<Team> {
    return this.teamModel.deleteOne({ _id: id });
  }

  update(team: INewTeam): Promise<Team> {
    const query: IMatchesQuery  = {};
    const { matches } = team;
    if (matches.length) {
      query.matches = matches;
    }
    return this.teamModel.findOneAndUpdate({ _id: team.id }, query, { new: true });
  }

  addMatchForTeam(title: string, matchId: string): Promise<Team> {
    return this.teamModel.findOneAndUpdate({ title }, { $push: { matches: matchId } ,title }, { upsert: true, new: true }).exec();
  }

}

