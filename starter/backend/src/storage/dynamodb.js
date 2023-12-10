import { createLogger } from '../utils/logger.mjs'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const logger = createLogger('DynamoDBStorage')
export default class DynamoDBStorage {
    constructor() {
        const client = new DynamoDBClient({});
        this.docClient = DynamoDBDocumentClient.from(client);
        this.tableName = process.env.TODOS_TABLE;
        this.tableIndex = process.env.TODOS_CREATED_AT_INDEX;
    }

    async createTodo(item) {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: item
        });
        return await this.docClient.send(command);
    }

    async getTodos(userId) {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });

        const response = await this.docClient.send(command);
        logger.info('response  getItems' + response)
        return response;
    }

    async editTodo(userId, todoId, updateData) {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: {
                ':n': updateData.name,
                ':due': updateData.dueDate,
                ':dn': updateData.done
            }
        });

        return await this.docClient.send(command);
    }

    async deleteTodo(userId, todoId) {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: { userId, todoId }
        });

        return await this.docClient.send(command);
    }

    async generateUploadUrl(userId, todoId, bucketName) {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
            }
        })

        return await this.docClient.send(command);
    }
}
