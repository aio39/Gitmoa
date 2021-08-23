import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'gitmoa',
  },
  plugins: ['serverless-offline', 'serverless-dotenv-plugin'],
  custom: {
    'serverless-offline': {
      httpPort: 4001,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'prod',
    environment: {
      NODE_ENV: 'dev',
      TEST: '${env:GITHUB_CLIENT_SECRET}',
    },
  },
  package: {
    individually: true,
    exclude: ['**/*'],
    include: ['dist/apps/sl-user-sync/**'],
  },
  functions: {
    main: {
      handler: 'dist/apps/sl-user-sync/main.handlerA',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/funcA',
          },
        },
      ],
    },
    main2: {
      handler: 'dist/apps/sl-user-sync/main.roomSyncLoadToSQS',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/rsl',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
