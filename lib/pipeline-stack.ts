import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class WorkshopPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.connection("miguelopezv/aws-cdk", "main", {
          connectionArn:
            "arn:aws:codeconnections:us-east-1:487704436915:connection/53bc62a5-bdf3-40cc-8d5f-66aa1a5d39f2",
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
