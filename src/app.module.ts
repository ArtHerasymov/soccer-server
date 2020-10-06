import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './modules/teams/teams.module';
import { MatchesModule } from './modules/matches/matches.module';

@Module({
  imports: [TeamsModule, MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL), MatchesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
