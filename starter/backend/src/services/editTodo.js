import DynamoDBStorage from '../storage/dynamodb.js'

export async function updateTodo(userId, todoId, newData) {
    return await new DynamoDBStorage().editTodo(userId, todoId, newData);
}