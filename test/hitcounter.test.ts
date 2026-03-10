import { Stack } from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter";

test("Dynamo DB Table Created", () => {
  const stack = new Stack();

  new HitCounter(stack, "MyTestConstruct", {
    downstream: new Function(stack, "TestFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: "hello.handler",
      code: Code.fromAsset("lambda"),
    }),
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("Lambda Has Environment Variables", () => {
  const stack = new Stack();

  new HitCounter(stack, "MyTestConstruct", {
    downstream: new Function(stack, "TestFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: "hello.handler",
      code: Code.fromAsset("lambda"),
    }),
  });

  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: "TestFunction22AD90FC",
      },
      HITS_TABLE_NAME: {
        Ref: "MyTestConstructHits24A357F0",
      },
    },
  });
});
