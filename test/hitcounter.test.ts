import { Stack } from "aws-cdk-lib";
import { Template, Capture } from "aws-cdk-lib/assertions";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { HitCounter } from "../lib/hitcounter";
import { TEST_CONSTANTS } from "../utils/constants";

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
        Ref: TEST_CONSTANTS.DOWNSTREAM_FUNCTION_NAME,
      },
      HITS_TABLE_NAME: {
        Ref: TEST_CONSTANTS.HITS_TABLE_NAME,
      },
    },
  });
});

test("DynamoDB Table Created With Encryption", () => {
  const stack = new Stack();

  new HitCounter(stack, "MyTestConstruct", {
    downstream: new Function(stack, "TestFunction", {
      runtime: Runtime.NODEJS_22_X,
      handler: "hello.handler",
      code: Code.fromAsset("lambda"),
    }),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});

test("read capacity can be configured", () => {
  const stack = new Stack();

  expect(() => {
    new HitCounter(stack, "MyTestConstruct", {
      downstream: new Function(stack, "TestFunction", {
        runtime: Runtime.NODEJS_22_X,
        handler: "hello.handler",
        code: Code.fromAsset("lambda"),
      }),
      readCapacity: 3,
    });
  }).toThrow("readCapacity must be between 5 and 20");
});
