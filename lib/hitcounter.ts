import {
  AttributeType,
  Table,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { CONSTANTS } from "../utils/constants";

export interface HitCounterProps {
  downstream: IFunction;
  // Optional read capacity for the DynamoDB table, greater than 5 and lower than 20 (default: 5)
  readCapacity?: number;
}

export class HitCounter extends Construct {
  public readonly handler: Function;
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    if (
      props.readCapacity &&
      (props.readCapacity < 5 || props.readCapacity > 20)
    ) {
      throw new Error("readCapacity must be between 5 and 20");
    }
    super(scope, id);

    this.table = new Table(this, CONSTANTS.HIT_COUNTER_TABLE_NAME, {
      partitionKey: { name: "path", type: AttributeType.STRING },
      encryption: TableEncryption.AWS_MANAGED,
      readCapacity: props.readCapacity ?? CONSTANTS.READ_CAPACITY,
    });

    this.handler = new Function(this, CONSTANTS.HIT_COUNTER_HANDLER_NAME, {
      runtime: Runtime.NODEJS_22_X,
      handler: "hitcounter.handler",
      code: Code.fromAsset("lambda"),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName,
      },
    });

    this.table.grantReadWriteData(this.handler);
    props.downstream.grantInvoke(this.handler);
  }
}
