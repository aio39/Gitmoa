export interface IConfigService {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  CALLBACK_URL: string;
  SECRET_KEY: string;
  ADMIN_ID_LIST: string;
}
