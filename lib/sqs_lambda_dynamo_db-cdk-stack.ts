import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';

//Define the Stack Class
export class SqsLambdaDynamoDbCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create an SQS Queue
    const myQueue = new sqs.Queue(this, 'MyQueue', {
      queueName: 'my-queue-cdk',
      visibilityTimeout: cdk.Duration.seconds(30)
    });

    //Create a DynamoDB Table
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'my-table-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    //Create a Lambda Function
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        TABLE_NAME: myTable.tableName
      }
    });
    
    //Grant Permissions to Lambda
    myTable.grantReadWriteData(myLambda);
    myQueue.grantConsumeMessages(myLambda);

    //Set SQS as Event Source for Lambda
    myLambda.addEventSource(new lambdaEventSources.SqsEventSource(myQueue));

    //Grant CloudWatch Logging Permissions to Lambda
    myLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: ['*'],
    }));
  }
}
