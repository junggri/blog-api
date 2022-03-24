import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

export const ctx = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        if (context.getType() === "http") {
            return context.switchToHttp().getRequest().res;
        }
        const ctx = GqlExecutionContext.create(context);

        return ctx.getContext().res;
    }
);