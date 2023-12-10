import DynamoDBStorage from '../storage/dynamodb.js'

export async function deleteTodo(userId, todoId) {
    return await new DynamoDBStorage().deleteTodo(userId, todoId);
}