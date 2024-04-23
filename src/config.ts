import dotenv from 'dotenv';
import * as process from 'process';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const nodeEnv = process.env.NODE_ENV || 'development';
let path = nodeEnv === 'development' ? '.env' : `.env.${nodeEnv}`;


dotenv.config({ path });

export const config = {
  nodeEnv,
  baseUrl: process.env.BASE_URI || 'http://localhost',
  uploadUrl: 'http://localhost:3014/api/uploads/',
  api: {
    port: process.env.PORT || 3014,
    transportPort: process.env.TRANSPORT_PORT || 4000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'very-secret-key',
    accessExpiration: Number(process.env.JWT_ACCESS_EXPIRATION || 3600),
    refreshExpiration: Number(process.env.JWT_REFRESH_EXPIRATION || 3600 * 24 * 30),
    algorithm: 'HS256',
  },
  db: {
    url: process.env.POSTGRES_URL,
  },
  typeorm: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE || 'scouts-office',
    namingStrategy: new SnakeNamingStrategy(),
    entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    migrationsRun: false,
    logging: process.env.POSTGRES_LOGGING === 'true',
  } as PostgresConnectionOptions,
  outward: {
    flag: {
      url: 'https://restcountries.com/v3.1/name',
    },
    ip: {
      url: 'https://api64.ipify.org?format=json',
    },
    location: {
      url: 'https://ipinfo.io',
      token: process.env.LOCATION_TOKEN || 'DEFAULT_TOKEN',
    },
    weather: {
      url: 'https://api.open-meteo.com/v1/forecast',
    },
    currency: {
      url: 'https://api.coinbase.com/v2/exchange-rates',
    },
    transfermarkt: {
      url: 'https://transfermarket.p.rapidapi.com',
      headers: {
        'X-RapidAPI-Key': process.env.TRANSFERMARKT_KEY ?? 'DEFAULT_KEY',
        'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com',
      },
    },
  },
};
