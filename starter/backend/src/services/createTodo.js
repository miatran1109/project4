import * as uuid from 'uuid';
import DynamoDBStorage from '../storage/dynamodb.js'

export async function createTodo(item, userId) {
    const todoId = uuid.v4();
    const timestamp = new Date().toISOString();
    const newTodo = {
        todoId,
        createdAt: timestamp,
        userId,
        ...item
    };

    await new DynamoDBStorage().createTodo(newTodo);
    return newTodo;
}