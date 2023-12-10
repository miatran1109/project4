import DynamoDBStorage from '../storage/dynamodb.js'

export async function getTodos(userId) {
     return { items: (await new DynamoDBStorage().getTodos(userId)).Items };
}