 import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { MongooseModule } from '@nestjs/mongoose';
 import { TeamSchema } from './teams.model';
 import { MatchSchema } from '../matches/match.model';

 @Module({
   imports:[MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]), MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }])],
   controllers: [TeamsController],
   providers: [TeamsService],
   exports: [TeamsService]
})
export class TeamsModule {}
