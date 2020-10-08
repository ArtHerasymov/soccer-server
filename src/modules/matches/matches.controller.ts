import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import {
  DATA_UPDATED_SUCCESS,
  MATCH_ADDED_SUCCESS,
  MATCH_DELETED_SUCCESS,
  MATCH_UPDATED_SUCCESS, TEAM_NOT_FOUND,
} from '../../helpers/messages';
import { AddMatchDto, DeleteMatchDto, GetMatchesDto, UpdateMatchDto } from '../../dto/matches.dto';

@Controller('matches')
export class MatchesController {

  constructor(private readonly matchesService: MatchesService) {}

  @Get('refresh')
  async refreshMatchData() {
    await this.matchesService.refreshMatchesData();
    return {
      message: DATA_UPDATED_SUCCESS.en,
    }
  }

  @Get('')
  async getMatches(@Query() query: GetMatchesDto) {
    const results = await this.matchesService.getMatches(query.teams, query.dateFrom, query.dateTo);
    if (!results.length) {
      throw new BadRequestException(TEAM_NOT_FOUND.en);
    }
    return results;
  }

  @Post('')
  async addMatch(@Body() body: AddMatchDto) {
    await this.matchesService.addMatch(body);
    return {
      message: MATCH_ADDED_SUCCESS.en,
    }
  }

  @Put('')
  async updateMatch(@Body() body: UpdateMatchDto) {
    const updatedMatch = await this.matchesService.updateMatch(body);
    return {
      message: MATCH_UPDATED_SUCCESS.en,
      data: updatedMatch,
    };
  }

  @Delete('')
  async deleteMatch(@Query() query: DeleteMatchDto) {
    await this.matchesService.deleteMatchById(query.id);
    return {
      message: MATCH_DELETED_SUCCESS.en,
    }
  }

}