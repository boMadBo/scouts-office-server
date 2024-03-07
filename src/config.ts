import * as process from 'process';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const nodeEnv = process.env.NODE_ENV || 'development';

export const config = {
  nodeEnv,
  baseUri: process.env.BASE_URI || 'https://localhost',
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
};
