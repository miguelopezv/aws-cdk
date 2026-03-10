import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { CONSTANTS } from "../utils/constants";

export class WorkshopPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.connection("miguelopezv/aws-cdk", "main", {
          connectionArn: CONSTANTS.CONNECTION_ARN,
        }),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    // // Añade aquí tus stages de aplicación
    // pipeline.addStage(new MyApplicationStage(this, 'Prod', {
    //   env: { account: '123456789012', region: 'us-east-1' }
    // }));
  }
}
