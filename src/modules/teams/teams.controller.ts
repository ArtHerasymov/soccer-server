import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import {
  AddTeamDto,
  DeleteTeamDto,
  EditTeamDto,
  GetRatioDto,
  GetResultsDto,
  GetTeamsDto,
} from '../../dto/teams.dto';
import {
  MATCHES_NOT_EXIST,
  SERVER_ERROR,
  TEAM_ADDED_SUCCESS,
  TEAM_DELETE_SUCCESS,
  TEAM_NOT_FOUND,
  TEAM_UPDATED_SUCCESS,
} from '../../helpers/messages';

@Controller('teams')
export class TeamsController {

  constructor(private readonly teamsService: TeamsService) {}

  @Get('')
  async getTeamsByTitle(@Query() query: GetTeamsDto) {
    try {
      const teams = await this.teamsService.searchTeamsByTitles(query.titles);
      return teams;
    } catch (e) {
      throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('results')
  async getSeasonResults(@Query() query: GetResultsDto) {
    try {
      const results = await this.teamsService.getResults(query.team);
      if (!results) {
        throw new BadRequestException(TEAM_NOT_FOUND.en);
      }
      return results;
    } catch (e) {
      throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('ratio')
  async getRatio(@Query() query: GetRatioDto) {
    try {
      const results = await this.teamsService.getRatio(query.team)
      if (!results) {
        throw new BadRequestException(TEAM_NOT_FOUND.en);
      }
      return results;
    } catch (e) {
      throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get('ranks')
  async getRanks() {
    try {
      const ranks = await this.teamsService.getRanks();
      return ranks;
    }
     catch (e) {
       throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('')
  async addTeam(@Body() team: AddTeamDto) {
    try {
      if(!(await this.teamsService.checkMatchesExist(team.matches))) {
        throw new HttpException(MATCHES_NOT_EXIST.en, HttpStatus.BAD_REQUEST);
      }
      await this.teamsService.addTeam(team);
      return {
        message: TEAM_ADDED_SUCCESS.en,
      }
    } catch (e) {
      throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('')
  async editTeam(@Body() team: EditTeamDto) {
    try {
      if(!(await this.teamsService.checkMatchesExist(team.matches))) {
        throw new HttpException(MATCHES_NOT_EXIST.en, HttpStatus.BAD_REQUEST);
      }
      await this.teamsService.editTeam(team);
      return {
        message: TEAM_UPDATED_SUCCESS.en,
      }
    } catch (e) {
      throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('')
  async deleteTeam(@Query() query: DeleteTeamDto) {
    try {
      await this.teamsService.deleteTeam(query.id);
      return {
        message: TEAM_DELETE_SUCCESS.en,
      }
    } catch (e) {
      throw new HttpException(SERVER_ERROR.en, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
