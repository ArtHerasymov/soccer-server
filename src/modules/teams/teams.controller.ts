import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import {
  AddTeamDto,
  DeleteTeamDto,
  EditTeamDto,
  GetRatioDto,
  GetResultsDto,
  GetTeamsDto,
} from '../../dto/teams.dto';
import { TEAM_ADDED_SUCCESS, TEAM_DELETE_SUCCESS, TEAM_NOT_FOUND, TEAM_UPDATED_SUCCESS } from '../../helpers/messages';

@Controller('teams')
export class TeamsController {

  constructor(private readonly teamsService: TeamsService) {}

  @Get('')
  getTeamsByTitle(@Query() query: GetTeamsDto) {
    return this.teamsService.searchTeamsByTitles(query.titles);
  }

  @Get('results')
  async getSeasonResults(@Query() query: GetResultsDto) {
    const results = await this.teamsService.getResults(query.team);
    if (!results.length) {
      throw new BadRequestException(TEAM_NOT_FOUND.en);
    }
    return results;
  }

  @Get('ratio')
  async getRation(@Query() query: GetRatioDto) {
    const results = await this.teamsService.getRatio(query.team)
    if (!results.length) {
      throw new BadRequestException(TEAM_NOT_FOUND.en);
    }
    return results;
  }

  @Get('ranks')
  async getRanks() {
    return this.teamsService.getRanks();
  }

  @Post('')
  async addTeam(@Body() team: AddTeamDto) {
    await this.teamsService.addTeam(team);
    return {
      message: TEAM_ADDED_SUCCESS.en,
    }
  }

  @Put('')
  async editTeam(@Body() team: EditTeamDto) {
    await this.teamsService.editTeam(team);
    return {
      message: TEAM_UPDATED_SUCCESS.en,
    }
  }

  @Delete('')
  async deleteTeam(@Query() query: DeleteTeamDto) {
    await this.teamsService.deleteTeam(query.id);
    return {
      message: TEAM_DELETE_SUCCESS.en,
    }
  }
}