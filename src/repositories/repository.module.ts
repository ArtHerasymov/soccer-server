import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from '../models/match.model';
import { TeamSchema } from '../models/teams.model';
import { MatchRepository } from './match.repository';
import { TeamRepository } from './team.repository';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]), MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }])],
  providers: [MatchRepository, TeamRepository],
  exports: [MatchRepository, TeamRepository],
})

export class RepositoryModule {}
