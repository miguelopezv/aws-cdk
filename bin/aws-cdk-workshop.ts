#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { AwsCdkWorkshopStack } from "../lib/aws-cdk-workshop-stack";
import { WorkshopPipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new AwsCdkWorkshopStack(app, "AwsCdkWorkshopStack");
new WorkshopPipelineStack(app, "AwsCdkWorkshopPipelineStack");
