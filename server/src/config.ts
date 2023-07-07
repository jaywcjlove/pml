import { TypeNexusOptions } from 'typenexus';
import { Session } from './entity/session.entity.js';

export const config: TypeNexusOptions = {
  cors: true,
  routePrefix: '/api',
  developmentMode: false,
  dataSourceOptions: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'wcjiang',
    database: process.env.POSTGRES_DB || 'pml',
    synchronize: true,
    logging: process.env.DB_LOGGING === 'false' ? false : true,
    entities: ['dist/entity/*.js'],
    // entities: [User],
  },
  session: {
    secret: 'secret-pml-2023',
    resave: false,
    saveUninitialized: false,
    repositoryTarget: Session,
    typeormStore: {
      cleanupLimit: 2,
      // limitSubquery: false, // If using MariaDB.
      ttl: 86400,
    },
  },
};

export const adminAccount = {
  email: 'wcj@admin.com',
  name: 'admin',
  password: '1234',
};
