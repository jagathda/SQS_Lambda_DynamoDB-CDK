import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';

//Stack Class
export class SqsLambdaDynamoDbCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Define the SQS Queue
    const myQueue = new sqs.Queue(this, 'MyQueue', {
      queueName: 'my-queue-cdk',
      visibilityTimeout: cdk.Duration.seconds(30)
    });

    //Define the DynamoDB Table
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'my-table-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
  }
}
