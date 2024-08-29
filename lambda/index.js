//Import Required AWS SDK Modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

//Initialize DynamoDB Client
const ddbClient = new DynamoDBClient();

//Define the Lambda Handler Function
exports.handler = async (event) => {

  //Loop Through Each Record in the Event
  for (const record of event.Records) {
    const { body } = record;
    let parsedBody;

    //Parse the SQS Message Body
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse message body:', e);
      continue;
    }

    //Validate and Process the Message
    if (parsedBody.action === 'queryItem' && parsedBody.key && parsedBody.key.id) {
      const id = parsedBody.key.id;

      //Set Up Parameters to Insert Item into DynamoDB
      const params = {
        TableName: process.env.TABLE_NAME,
        Item: { id },
      };

      //Insert the Item into DynamoDB
      try {
        await ddbClient.send(new PutCommand(params));
        console.log('Successfully inserted item with id:', id);
      } catch (error) {
        console.error('Failed to insert item:', error);
      }
    } else {
      console.error('Invalid message body, missing key.id:', parsedBody);
    }
  }
};
