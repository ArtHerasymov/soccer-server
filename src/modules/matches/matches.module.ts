import { HttpModule, Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { RepositoryModule } from '../../repositories/repository.module';

@Module({
  imports: [RepositoryModule, HttpModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
