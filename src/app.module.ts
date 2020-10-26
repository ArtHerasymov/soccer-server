import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './modules/teams/teams.module';
import { MatchesModule } from './modules/matches/matches.module';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from './repositories/repository.module';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL), TeamsModule, MatchesModule, RepositoryModule],
})
export class AppModule {}
