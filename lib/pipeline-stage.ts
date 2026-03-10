import { AwsCdkWorkshopStack } from "./aws-cdk-workshop-stack";
import { Stage, StageProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new AwsCdkWorkshopStack(this, "WebService");
  }
}
