import { OutwardService } from '@app/modules/outward/outward.service';
import {
  ICurrentNews,
  INewsResult,
  IPlayer,
  ISearch,
  ISeason,
  ISquad,
  IStatsResult,
  ITeam,
  ITransfer,
  IValueHistory,
} from '@app/modules/outward/types';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('transfermarkt')
@ApiTags('Transfermarkt')
export class OutwardTransfermarktController {
  constructor(private readonly outwardService: OutwardService) {}

  @Get('/teams/:leagueId')
  @HttpCode(HttpStatus.OK)
  async getLeagueTeams(@Param('leagueId') leagueId: string): Promise<ITeam> {
    return this.outwardService.getLeagueTeams(leagueId);
  }

  @Get('/squad/:teamId')
  @HttpCode(HttpStatus.OK)
  async getSquad(@Param('teamId') teamId: string): Promise<ISquad[]> {
    return this.outwardService.getSquad(teamId);
  }

  @Get('/player/:id')
  @HttpCode(HttpStatus.OK)
  async getPlayer(@Param('id') id: string): Promise<IPlayer> {
    return this.outwardService.getPlayer(id);
  }

  @Get('/value-history/:id')
  @HttpCode(HttpStatus.OK)
  async getValueHistory(@Param('id') id: string): Promise<IValueHistory[]> {
    return this.outwardService.getValueHistory(id);
  }

  @Get('/seasons/:id')
  @HttpCode(HttpStatus.OK)
  async getSeasons(@Param('id') id: string): Promise<ISeason[]> {
    return this.outwardService.getSeasons(id);
  }

  @Get('/stats/:id')
  @HttpCode(HttpStatus.OK)
  async getStats(@Param('id') id: string, @Query('seasonID') seasonID: string): Promise<IStatsResult> {
    return this.outwardService.getStats(id, seasonID);
  }

  @Get('/transfers/:id')
  @HttpCode(HttpStatus.OK)
  async getTransfers(@Param('id') id: string): Promise<ITransfer[]> {
    return this.outwardService.getTransfers(id);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async search(@Query('value') value: string): Promise<ISearch> {
    return this.outwardService.search(value);
  }

  @Get('/news')
  @HttpCode(HttpStatus.OK)
  async getNews(): Promise<INewsResult> {
    return this.outwardService.getNews();
  }

  @Get('/news/:id')
  @HttpCode(HttpStatus.OK)
  async getNewsById(@Param('id') id: string): Promise<ICurrentNews> {
    return this.outwardService.getNewsById(id);
  }
}
