import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from '../../models/teams.model';
import { Match } from '../../models/match.model';

@Injectable()
export class TeamsService {

  constructor(
    @InjectModel('Team') private readonly teamModel: Model<Team>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
  ) {}

  async searchTeamsByTitles(titles: string) {
    if (!titles) {
      return this.teamModel.find().populate('matches');
    }
    return this.teamModel.find({ title: { $in: titles.split(',') } }).populate('matches');
  }

  async getResults(title: string) {
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

  async getRatio(title: string) {
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
    ])
  }

  async getRanks() {
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

  async addTeam(team: Team) {
    const existingMatches = this.matchModel.find({ _id: { $in: team.matches } });
    if (!existingMatches.length || existingMatches.length !== team.matches.length) {
      return;
    }
    const newTeam = new this.teamModel({ title: team.title, matches: existingMatches.map(match => match._id) });
    return newTeam.save();
  }

  async editTeam(team: Team) {
    const updateQuery = team;
    if (team.matches) {
      const existingMatches = this.matchModel.find({ _id: { $in: team.matches } });
      if (!existingMatches.length || existingMatches.length !== team.matches.length) {
        return;
      }
      updateQuery.matches = existingMatches.map(match => match._id);
    }
    return this.teamModel.findOneAndUpdate({ _id: team.id }, updateQuery, { new: true });
  }

  async deleteTeam(id: string) {
    return this.teamModel.deleteOne({ _id: id });
  }

  updateMatchForTeam(title: string, id: string) {
    this.teamModel.findOneAndUpdate({ title }, { $push: { matches: id } ,title: title }, { upsert: true, new: true }).exec();
  }

}
