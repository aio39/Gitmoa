import type { Serverless } from 'serverless/aws';

console.dir(process.env, { depth: null });

const serverlessConfiguration: Serverless = {
  app: 'gitmoa',
  service: {
    name: 'gitmoa-service',
  },
  configValidationMode: 'warn',
  plugins: ['serverless-offline', 'serverless-dotenv-plugin'],
  custom: {
    'serverless-offline': {
      httpPort: 4001,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: '${env:REGION}', // AWS_RESIGN 은 예약어 오류 뜸.
    stackName: 'sls-gitmoa',
    stage: '${env:STAGE}',
    environment: {
      NODE_ENV: 'dev',
      TEST: '${env:GITHUB_CLIENT_SECRET}',
    },
  },
  package: {
    individually: false,
    exclude: ['**/*'],
    include: ['dist/apps/sl-user-sync/**'],
  },
  functions: {
    test: {
      name: 'test_function', // name에 공백 들어가면 안 됨.
      handler: 'dist/apps/sl-user-sync/main.testHandler',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/test',
          },
        },
      ],
    },
    rs: {
      handler: 'dist/apps/sl-user-sync/main.roomSync',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/room_sync',
          },
        },
      ],
    },
    rsls: {
      handler: 'dist/apps/sl-user-sync/main.roomSyncLoadToSQS',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/room_sync_load_to_sqs',
          },
          schedule: {
            description: 'invoke load room sync list to SQS ',
            rate: 'cron(0 0 5,11,17,23 ? * * *)',
            enabled: true,
          },
        },
      ],
    },
    rssc: {
      handler: 'dist/apps/sl-user-sync/main.roomSyncConsumer',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/room_sync_sqs_consumer',
          },
          schedule: {
            description: 'invoke load from sqs, and invoke list room sync ',
            rate: 'rate(1 minutes)',
            enabled: true,
          },
        },
      ],
    },
    us: {
      handler: 'dist/apps/sl-user-sync/main.userSync',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/user_sync',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
