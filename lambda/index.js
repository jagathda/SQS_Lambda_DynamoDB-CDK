const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const ddbClient = new DynamoDBClient();

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  for (const record of event.Records) {
    const { body } = record;
    let parsedBody;
    
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse message body:', e);
      continue;
    }

    if (parsedBody.action === 'queryItem') {
      const id = parsedBody.key.id;
      
      try {
        const params = {
          TableName: process.env.TABLE_NAME,
          Item: { id },
        };
        await ddbClient.send(new PutCommand(params));
        console.log('Successfully inserted item with id:', id);
      } catch (error) {
        console.error('Failed to insert item:', error);
      }
    }
  }
};
