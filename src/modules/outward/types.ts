export interface ILocationData {
  latitude: number;
  longitude: number;
}

export interface IWeatherResult {
  temperature: number;
  rain: number;
  snowfall: number;
}

export interface ICountryFlag {
  flag: string;
}

export interface IBtcAndUsdCurrency {
  BTC: string;
  USD: string;
}

export interface ITeam {
  clubImage: string;
  clubName: string;
  draw: number;
  goalDifference: number;
  goals: number;
  goalsConceded: number;
  group: null;
  id: string;
  losses: number;
  markClass: string;
  markColor: string;
  markDescription: string;
  markID: string;
  matches: number;
  oldRank: number;
  points: number;
  rank: number;
  wins: number;
}

export interface IResponseSquad {
  height: string;
  foot: string;
  injury: Injury | null;
  suspension: null;
  joined: number;
  contractUntil: number;
  captain: boolean;
  lastClub: null;
  isLoan: null;
  wasLoan: null;
  id: string;
  name: string;
  image: string;
  imageLarge: null;
  imageSource: string;
  shirtNumber: string;
  age: number;
  dateOfBirth: number;
  heroImage: string;
  isGoalkeeper: boolean;
  positions: IPositionGroup;
  nationalities: INationality[];
  marketValue: IMarketValue;
}

interface Injury {
  id: string;
  description: string;
  until: null;
  category: string;
  rehabilitation: string;
  clubIdStart: null;
  clubIdEnd: null;
}

interface IPositionGroup {
  first: IPosition;
  second: IPosition | null;
  third: IPosition | null;
}

interface IPosition {
  id: string;
  name: string;
  shortName: string;
  group: string;
}

interface INationality {
  id: number;
  name: string;
  image: string;
}

interface IMarketValue {
  value: number;
  currency: string;
  progression: null;
}

export interface ISquad {
  age: number;
  dateOfBirth: string;
  flag: string;
  id: string;
  image: string;
  name: string;
  positionFull: string;
  positionGroup: string;
  positionShort: string;
  shirtNumber: string;
  value: string;
}

export interface IPlayer {
  playerID: string | undefined;
  playerImage: string | undefined;
  playerName: string | undefined;
  dateOfBirth: string | undefined;
  playerShirtNumber: string | undefined;
  age: string | undefined;
  height: string | undefined;
  foot: string | undefined;
  country: string | undefined;
  countryImage: string | undefined;
  internationalGames: string | undefined;
  internationalGoals: string | undefined;
  league: string | undefined;
  leagueLogo: string | undefined;
  clubImage: string | undefined;
  club: string | undefined;
  clubId: string | undefined;
  loanUntil: string | undefined;
  LoanOwnerName: string | undefined;
  ownerImage: string | undefined;
  contractExpiryDate: string | undefined;
  agent: string | undefined;
  agentId: string | undefined;
  playerMainPosition: string | undefined;
  playerSecondPosition: string | undefined;
  playerThirdPosition: string | undefined;
  marketValue: string | undefined;
  marketValueNumeral: string | undefined;
  marketValueCurrency: string | undefined;
  injuryTitle: string | undefined;
  injuryUntil: string | undefined;
}

export interface IValueHistoryResponse {
  date: string | undefined;
  unformattedDate: string | undefined;
  age: string | undefined;
  marketValue: string | undefined;
  marketValueUnformatted: number | undefined;
  marketValueCurrency: string | undefined;
  marketValueNumeral: string | undefined;
  clubID: string | undefined;
  clubName: string | undefined;
  clubShortName: string | undefined;
  clubImage: string | undefined;
  seasonID: string | undefined;
}

export interface IValueHistory {
  date: string | undefined;
  age: string | undefined;
  marketValue: string | undefined;
  mValueUnform: number | undefined;
  mValueCurr: string | undefined;
  mValueNum: string | undefined;
  clubName: string | undefined;
}

export interface ISeason {
  key: string | undefined;
  title: string | undefined;
}

export interface IStatsResponse {
  competition: {
    id: string;
    name: string;
    shortName: string;
    image: string;
    leagueLevel: null;
    isTournament: null;
  };
  performance: {
    ownGoals: string;
    yellowCards: string;
    yellowRedCards: string;
    redCards: string;
    minutesPlayed: number;
    penaltyGoals: string;
    minutesPerGoal: number;
    matches: string;
    goals: string;
    assists: string;
    toNil: number;
    concededGoals: number;
    isGoalkeeper: null | true;
  };
  clubs: {
    id: string;
    name: string;
    fullName: string;
    image: string;
    nationalTeam: string;
    flag: null;
    marketValue: null;
    mainCompetition: null;
  }[];
}

export interface IStats {
  compId: string | undefined;
  compName: string | undefined;
  compImage: string | undefined;
  yellowCards: string | undefined;
  redCards: string | undefined;
  minutesPlayed: number | undefined;
  penaltyGoals: string | undefined;
  minutesPerGoal: number | undefined;
  matches: string | undefined;
  goals: string | undefined;
  assists: string | undefined;
  toNil: number | undefined;
  concededGoals: number | undefined;
  isGoalkeeper: null | boolean | undefined;
}

export interface IStatsResult {
  stats: IStats[];
  isGK: boolean;
}

export interface ITransferResponse {
  playerID: string | undefined;
  oldClubID: string | undefined;
  oldClubName: string | undefined;
  oldClubImage: string | undefined;
  newClubID: string | undefined;
  newClubName: string | undefined;
  newClubImage: string | undefined;
  transferFeeValue: string | undefined;
  transferFeeCurrency: string | undefined;
  transferFeeNumeral: string | undefined;
  playerName: string | undefined;
  playerImage: string | undefined;
  countryID: string | undefined;
  countryImage: string | undefined;
  loan: string | undefined;
  date: string | undefined;
  season: string | undefined;
  newClubCountryName: string | undefined;
  newClubCountryImage: string | undefined;
}

export interface ITransfer {
  playerID: string | undefined;
  oldClubID: string | undefined;
  oldClubName: string | undefined;
  oldClubImage: string | undefined;
  newClubID: string | undefined;
  newClubName: string | undefined;
  newClubImage: string | undefined;
  feeValue: string | undefined;
  feeCurrency: string | undefined;
  feeNumeral: string | undefined;
  loan: string | undefined;
  date: string | undefined;
  season: string | undefined;
}

interface ICount {
  players: number | undefined;
  coaches: number | undefined;
  clubs: number | undefined;
  competitions: number | undefined;
  referees: number | undefined;
}

interface ISearchPlayer {
  id: string | undefined;
  playerName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  alias: string | undefined;
  nationImage: string | undefined;
  club: string | undefined;
  playerImage: string | undefined;
}

interface ICoach {
  coachImage: string | undefined;
  coachName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  alias: string | undefined;
  currentFunction: string | undefined;
  club: string | undefined;
  nationImage: string | undefined;
}

interface IClub {
  id: string | undefined;
  league: string | undefined;
  competitionID: string | undefined;
  competitionName: string | undefined;
  name: string | undefined;
  logoImage: string | undefined;
}

interface IReferee {
  id: string | undefined;
  refereeImage: string | undefined;
  refereeName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  alias: string | undefined;
  club: string | undefined;
  nationImage: string | undefined;
}

interface ICompetition {
  id: string | undefined;
  competitionName: string | undefined;
  competitionImage: string | undefined;
  country: string | undefined;
  countryImage: string | undefined;
}

export interface ISearch {
  count?: ICount;
  players?: ISearchPlayer[];
  coaches?: ICoach[];
  clubs?: IClub[];
  referees?: IReferee[];
  competitions?: ICompetition[];
}

export interface INewsResponse {
  id: string | undefined;
  newsHeadline: string | undefined;
  timestamp: number | undefined;
  newsSecondImage: string | undefined;
  newsDate: string | undefined;
  fullNewsDate: string | undefined;
  newsTime: string | undefined;
  newsSource: string | undefined;
  newsStartPageFlag: string | null;
  newsShortMessageFlag: string | null;
  newsTeaser: string | undefined;
  newsFirstImage: string | undefined;
  newsSpotlightFirstImage: string | undefined;
  newsSpotlightSecondImage: string | undefined;
  newsCategoryID: string | undefined;
  newsCategoryTag: string | undefined;
  newsTickerFlag: string | undefined;
  newsUpdateFlag: string | undefined;
  newsAdFlag: string | undefined;
  spotlightPriority: string | undefined;
}

export interface INews {
  id: string | undefined;
  newsHead: string | undefined;
  newsHeadline: string | undefined;
  timestamp: number | undefined;
  newsPlayerImage: string | undefined;
  newsClubImage: string | undefined;
  newsSpotlightImage: string | undefined;
  newsDate: string | undefined;
  newsTime: string | undefined;
  newsSource: string | undefined;
  newsTeaser: string | undefined;
}

export interface INewsResult {
  headNews: INews[];
  tapeNews: INews[];
}

export interface ICurrentNews {
  id: string | undefined;
  headline: string | undefined;
  timestamp: number | undefined;
  formdDate: string;
  firstImage: string | undefined;
  secondImage: string | undefined;
  heroImage: string | undefined;
  text: string;
}
