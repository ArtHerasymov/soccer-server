import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { RepositoryModule } from '../../repositories/repository.module';

@Module({
   imports: [RepositoryModule],
   controllers: [TeamsController],
   providers: [TeamsService],
})
export class TeamsModule {}
