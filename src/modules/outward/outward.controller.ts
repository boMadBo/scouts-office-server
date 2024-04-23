import { OutwardService } from '@app/modules/outward/outward.service';
import { IBtcAndUsdCurrency, ICountryFlag, IWeatherResult } from '@app/modules/outward/types';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Outward')
export class OutwardController {
  constructor(private readonly outwardService: OutwardService) {}

  @Get('/flag/:country')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get country flag image',
  })
  async getFlag(@Param('country') country: string): Promise<ICountryFlag> {
    return this.outwardService.getFlag(country);
  }

  @Get('/weather')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get weather on current location',
  })
  async getWeather(): Promise<IWeatherResult> {
    return this.outwardService.getWeather();
  }

  @Get('/currency/:value?')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get live currency',
  })
  async getBTCAndUSDCurrency(@Param('value') value: string = 'EUR'): Promise<IBtcAndUsdCurrency> {
    return this.outwardService.getBTCAndUSDCurrency(value);
  }
}
