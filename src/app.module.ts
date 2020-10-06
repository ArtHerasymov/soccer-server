import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [TeamsModule, MongooseModule.forRoot('mongodb+srv://backender:Up35ATzGTR387I2t@cluster0.fscez.mongodb.net/soccer?retryWrites=true&w=majority'), MatchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
