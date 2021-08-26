import type { Serverless } from 'serverless/aws';
import sls_fn_names from './apps/sls-lambda/src/sls_const';

const sls_lambda_path = 'dist/apps/sls-lambda';

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
    stackName: 'sls-gitmoa-a',
    stage: '${env:STAGE}',
    memorySize: 256,
    deploymentBucket: {
      name: 'gitmoa-sls-bucket',
    },
    iam: {
      role: {
        name: 'lambda_admin',
        statements: [
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'], //NOTE 공백 들어갔다고 오류, 정책 편집기 들어가면 경고 사항 볼 수 있음.
            Resource: ['arn:aws:lambda:ap-northeast-2:*:function:*'],
          },
        ],
      },
    },
    environment: {
      NODE_ENV: 'dev',
      TEST: '${env:GITHUB_CLIENT_SECRET}',
    },
  },
  package: {
    individually: false,
    excludeDevDependencies: false, // webpack에서 tree shaking 했으니 false
    exclude: ['**/*', 'node_modules/**'],
    include: ['dist/apps/sls-lambda/**'],
  },
  functions: {
    test: {
      name: sls_fn_names.TEST_HANDLER, // name에 공백 들어가면 안 됨.
      handler: 'dist/apps/sls-lambda/main.testHandler',
      description: '테스트용 함수',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/' + sls_fn_names.TEST_HANDLER,
          },
        },
      ],
    },
    rs: {
      handler: 'dist/apps/sls-lambda/main.roomSync',
      name: sls_fn_names.ROOM_SYNC,
      events: [
        {
          http: {
            method: 'ANY',
            path: '/' + sls_fn_names.ROOM_SYNC,
          },
        },
      ],
    },
    rsls: {
      handler: 'dist/apps/sls-lambda/main.roomSyncLoadToSQS',
      name: sls_fn_names.ROOM_SYNC_LOAD_TO_SQS,
      events: [
        {
          http: {
            method: 'ANY',
            path: '/' + sls_fn_names.ROOM_SYNC_LOAD_TO_SQS,
          },
          schedule: {
            description: 'invoke load room sync list to SQS ',
            rate: 'cron(0 5,11,17,23 ? * * *)',
            enabled: false,
          },
        },
      ],
    },
    rssc: {
      handler: 'dist/apps/sls-lambda/main.roomSyncConsumer',
      name: sls_fn_names.ROOM_SYNC_CONSUMER,
      events: [
        {
          http: {
            method: 'ANY',
            path: '/' + sls_fn_names.ROOM_SYNC_CONSUMER,
          },
          schedule: {
            description: 'invoke load from sqs, and invoke list room sync ',
            rate: 'cron(* * * ? * *)',
            enabled: false,
          },
        },
      ],
    },
    us: {
      handler: 'dist/apps/sls-lambda/main.userSync',
      name: sls_fn_names.USER_SYNC,
      events: [
        {
          http: {
            method: 'ANY',
            path: '/' + sls_fn_names.USER_SYNC,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
