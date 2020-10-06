import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from '../teams/teams.module';
import { MatchSchema } from '../../models/match.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]), TeamsModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
