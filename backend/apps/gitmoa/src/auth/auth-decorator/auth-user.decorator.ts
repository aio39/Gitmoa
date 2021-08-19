import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

type callback = (
  data: unknown,
  context: ExecutionContext,
) => {
  token: string;
};

//  NOTE  JWT로 Gql의 Context User에 저장한 정보를 추출하여 Param으로 넘겨줍니다.
export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): callback => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log(gqlContext);
    const user = gqlContext['user'];
    // console.log(gqlContext['Cookies']);
    // console.log(gqlContext['token']);
    console.log(user);
    return user;
  },
);
