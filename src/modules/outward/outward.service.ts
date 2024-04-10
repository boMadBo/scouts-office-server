import { config } from '@app/config';
import { positionOrder, positionShortOrder } from '@app/modules/outward/helpers';
import {
  IBtcAndUsdCurrency,
  ICountryFlag,
  ICurrentNews,
  ILocationData,
  INews,
  INewsResponse,
  INewsResult,
  IPlayer,
  IResponseSquad,
  ISearch,
  ISeason,
  ISquad,
  IStatsResponse,
  IStatsResult,
  ITeam,
  ITransfer,
  ITransferResponse,
  IValueHistory,
  IValueHistoryResponse,
  IWeatherResult,
} from '@app/modules/outward/types';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class OutwardService {
  constructor(private httpService: HttpService) {}

  async getFlag(country: string): Promise<ICountryFlag> {
    return this.httpService
      .get(`${config.outward.flag.url}/${country}`)
      .toPromise()
      .then(response => {
        return { flag: response.data[0].flags.svg };
      });
  }

  async getIP(): Promise<string> {
    return this.httpService
      .get(`${config.outward.ip.url}`)
      .toPromise()
      .then(response => response.data.ip);
  }

  async getLocation(): Promise<ILocationData> {
    const ip = await this.getIP();
    const response = await this.httpService
      .get(`${config.outward.location.url}/${ip}?token=${config.outward.location.token}`)
      .toPromise()
      .then(response => response.data.loc);

    const latitude = Number(response.split(',')[0]);
    const longitude = Number(response.split(',')[1]);
    return { latitude, longitude };
  }

  async getWeather(): Promise<IWeatherResult> {
    const { latitude, longitude } = await this.getLocation();
    const date = moment().format('YYYY-MM-DD');
    const hour = moment().format('HH');

    const url = `${config.outward.weather.url}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,snowfall&start_date=${date}&end_date=${date}&timezone=auto`;

    const response = await this.httpService
      .get(url)
      .toPromise()
      .then(response => response.data);

    const dataWithTime = {
      ...response.hourly,
      time: response.hourly.time.map((item: string) => moment(item).format('HH')),
    };

    const time = dataWithTime.time.findIndex((time: string) => time === hour);
    const temperature = response.hourly.temperature_2m[time];
    const rain = response.hourly.rain[time];
    const snowfall = response.hourly.snowfall[time];

    return { temperature, rain, snowfall };
  }

  async getBTCAndUSDCurrency(value: string): Promise<IBtcAndUsdCurrency> {
    const response = await this.httpService
      .get(`${config.outward.currency.url}?currency=${value}`)
      .toPromise()
      .then(response => response.data.data.rates);

    return {
      BTC: response?.BTC,
      USD: response?.USD,
    };
  }

  async getLeagueTeams(id: string): Promise<ITeam> {
    const url = `${config.outward.transfermarkt.url}/competitions/get-table?id=${id}&seasonID=2023&domain=com`;
    return this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.table);
  }

  async getSquad(id: string): Promise<ISquad[]> {
    const url = `${config.outward.transfermarkt.url}/clubs/get-squad?id=${id}&saison_id=2023&domain=com`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.squad);

    const result = response.map((item: IResponseSquad) => {
      const id = item.id;
      const shirtNumber = item.shirtNumber;
      const image = item.image;
      const name = item.name;
      const dateOfBirth = this.getFormattedDate(item.dateOfBirth);
      const age = item.age;
      const positionGroup = item.positions.first.group;
      const positionFull = item.positions.first.name;
      const positionShort = item.positions.first.shortName;
      const flag = item.nationalities[0].image;
      const value = this.getMarketValue(item.marketValue.value) + ' ' + item.marketValue.currency;
      return {
        id,
        shirtNumber,
        image,
        name,
        dateOfBirth,
        age,
        positionGroup,
        positionFull,
        positionShort,
        flag,
        value,
      };
    });

    return this.sortPositions(result);
  }

  async getPlayer(id: string): Promise<IPlayer> {
    const url = `${config.outward.transfermarkt.url}/players/get-profile?id=${id}&domain=com`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.playerProfile);

    return {
      playerID: response?.playerID,
      playerImage: response?.playerImage,
      playerName: response?.playerName,
      dateOfBirth: response?.dateOfBirth,
      playerShirtNumber: response?.playerShirtNumber,
      age: response?.age,
      height: response?.height,
      foot: response?.foot,
      country: response?.country,
      countryImage: response?.countryImage,
      internationalGames: response?.internationalGames,
      internationalGoals: response?.internationalGoals,
      league: response?.league,
      leagueLogo: response?.leagueLogo,
      clubImage: response?.clubImage,
      club: response?.club,
      clubId: response?.clubId,
      loanUntil: response?.loan.loanUntil,
      LoanOwnerName: response?.loan.ownerName,
      ownerImage: response?.loan.ownerImage,
      contractExpiryDate: response?.contractExpiryDate,
      agent: response?.agent,
      agentId: response?.agentId,
      playerMainPosition: response?.playerMainPosition,
      playerSecondPosition: response?.playerSecondPosition,
      playerThirdPosition: response?.playerThirdPosition,
      marketValue: response?.marketValue,
      marketValueCurrency: response?.marketValueCurrency,
      marketValueNumeral: response?.marketValueNumeral,
      injuryTitle: response?.injury.title,
      injuryUntil: response?.injury.until,
    };
  }

  async getValueHistory(id: string): Promise<IValueHistory[]> {
    const url = `${config.outward.transfermarkt.url}/players/get-market-value?id=${id}&domain=com`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.marketValueDevelopment);

    const newDate = response.map((item: IValueHistoryResponse) => {
      const dateObject = moment(item.unformattedDate, 'YYYY-MM-DD');
      return dateObject.format('DD MMM YYYY');
    });

    const result = response.map((item: IValueHistoryResponse, index: number) => {
      const date = newDate[index];
      const age = item.age;
      const marketValue = item.marketValue;
      const mValueUnform = item.marketValueUnformatted;
      const mValueCurr = item.marketValueCurrency;
      const mValueNum = item.marketValueNumeral;
      const clubName = item.clubName;
      return {
        date,
        age,
        marketValue,
        mValueUnform,
        mValueCurr,
        mValueNum,
        clubName,
      };
    });

    return result;
  }

  async getSeasons(id: string): Promise<ISeason[]> {
    const url = `${config.outward.transfermarkt.url}/players/get-performance-summary?id=${id}&domain=com`;
    return this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.seasons);
  }

  async getStats(id: string, seasonID: string): Promise<IStatsResult> {
    const url = `${config.outward.transfermarkt.url}/players/get-performance-summary?id=${id}&seasonID=${seasonID}&domain=com`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.competitionPerformanceSummery);

    const stats = response.map((item: IStatsResponse) => {
      const compId = item.competition.id;
      const compName = item.competition.name;
      const compImage = item.competition.image;
      const yellowCards = item.performance.yellowCards;
      const redCards = item.performance.redCards;
      const minutesPlayed = item.performance.minutesPlayed;
      const penaltyGoals = item.performance.penaltyGoals;
      const minutesPerGoal = item.performance.minutesPerGoal;
      const matches = item.performance.matches;
      const goals = item.performance.goals;
      const assists = item.performance.assists;
      const toNil = item.performance.toNil;
      const concededGoals = item.performance.concededGoals;
      const isGoalkeeper = item.performance.isGoalkeeper;
      return {
        compId,
        compName,
        compImage,
        yellowCards,
        redCards,
        minutesPlayed,
        penaltyGoals,
        minutesPerGoal,
        matches,
        goals,
        assists,
        toNil,
        concededGoals,
        isGoalkeeper,
      };
    });

    const isGK = stats[0]?.isGoalkeeper;

    return { stats, isGK };
  }

  async getTransfers(id: string): Promise<ITransfer[]> {
    const url = `${config.outward.transfermarkt.url}/players/get-transfer-history?id=${id}&domain=com`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.transferHistory);

    const result = response.map((item: ITransferResponse) => {
      const playerID = item.playerID,
        oldClubID = item.oldClubID,
        oldClubName = item.oldClubName,
        oldClubImage = item.oldClubImage,
        newClubID = item.newClubID,
        newClubName = item.newClubName,
        newClubImage = item.newClubImage,
        feeValue = item.transferFeeValue,
        feeCurrency = item.transferFeeCurrency,
        feeNumeral = item.transferFeeNumeral,
        loan = item.loan,
        date = item.date,
        season = item.season;

      return {
        playerID,
        oldClubID,
        oldClubName,
        oldClubImage,
        newClubID,
        newClubName,
        newClubImage,
        feeValue,
        feeCurrency,
        feeNumeral,
        loan,
        date,
        season,
      };
    });

    return result;
  }

  async search(value: string): Promise<ISearch> {
    const url = `${config.outward.transfermarkt.url}/search?query=${value}`;
    return this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data);
  }

  async getNews(): Promise<INewsResult> {
    const url = `${config.outward.transfermarkt.url}/news/list-latest?domain=com`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.news);

    const result = response.map((item: INewsResponse) => {
      const id = item.id;
      const newsHead = item.newsHeadline?.split(/[?\-:]/)[0].trim();
      const newsHeadline = item.newsHeadline;
      const timestamp = item.timestamp;
      const newsPlayerImage = item.newsFirstImage;
      const newsClubImage = item.newsSecondImage;
      const newsSpotlightImage = item.newsSpotlightFirstImage;
      const newsDate = item.newsDate;
      const newsTime = item.newsTime;
      const newsSource = item.newsSource;
      const newsTeaser = item.newsTeaser;
      return {
        id,
        newsHead,
        newsHeadline,
        timestamp,
        newsPlayerImage,
        newsClubImage,
        newsSpotlightImage,
        newsDate,
        newsTime,
        newsSource,
        newsTeaser,
      };
    });

    const headNews = result
      .filter((item: INews) => item.newsSpotlightImage !== undefined && item.newsSpotlightImage.length > 0)
      .slice(0, 3);
    const tapeNews = result.filter((item: INews) => !headNews.some((headItem: INews) => headItem.id === item.id));

    return { headNews, tapeNews };
  }

  async getNewsById(id: string): Promise<ICurrentNews> {
    const url = `${config.outward.transfermarkt.url}/news/detail?id=${id}`;
    const response = await this.httpService
      .get(url, { headers: config.outward.transfermarkt.headers })
      .toPromise()
      .then(response => response.data.news);

    const htmlTagRegex = /<\/?[^>]+(>|$)|&[^;]+;/g;
    const combinedText = (Object.values(response.text)[0] as string).replace(htmlTagRegex, ' ');
    const formattedDate = moment.unix(response.timestamp).format('MMM D, YYYY HH:mm');

    return {
      id: response?.id,
      headline: response?.headline,
      timestamp: response?.timestamp,
      formdDate: formattedDate,
      firstImage: response?.firstImage,
      secondImage: response?.secondImage,
      heroImage: response?.heroImage,
      text: combinedText,
    };
  }

  private sortPositions = (array: ISquad[]) => {
    if (array) {
      array.sort((a, b) => {
        const positionDiff = positionOrder[a.positionGroup] - positionOrder[b.positionGroup];
        if (positionDiff !== 0) {
          return positionDiff;
        }

        const shortOrderA = positionShortOrder[a.positionShort];
        const shortOrderB = positionShortOrder[b.positionShort];
        if (shortOrderA !== undefined && shortOrderB !== undefined && shortOrderA !== shortOrderB) {
          return shortOrderA - shortOrderB;
        }

        const shirtNumberA = parseInt(a.shirtNumber);
        const shirtNumberB = parseInt(b.shirtNumber);

        if (!isNaN(shirtNumberA) && !isNaN(shirtNumberB)) {
          return shirtNumberA - shirtNumberB;
        }

        return 0;
      });
    }
    return array;
  };

  private getFormattedMonth = (month: string) => {
    if (month.length > 4) {
      return month.slice(0, 3) + '.';
    }
    return month;
  };

  private getFormattedDate = (timestamp: number) => {
    const formattedDate = moment.unix(timestamp).format('DD MMMM YYYY');
    const formattedMonth = this.getFormattedMonth(formattedDate.split(' ')[1]);
    const finalFormattedDate = formattedDate.replace(formattedDate.split(' ')[1], formattedMonth);
    return finalFormattedDate;
  };

  private getMarketValue = (value: number) => {
    let res = value.toString();
    if (res.length >= 7) {
      res = res.slice(0, -6) + ',' + res.slice(-6, -4) + ' ' + 'm';
    } else {
      res = res.slice(0, -3) + ' ' + 'k';
    }
    return res;
  };
}
