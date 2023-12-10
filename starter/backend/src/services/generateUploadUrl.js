import DynamoDBStorage from '../storage/dynamodb.js'
import {S3Client,PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

export async function generateUploadUrl(userId, todoId) {
    const bucketName = process.env.BUCKET;
    const s3Params = {
        Bucket: bucketName,
        Key: todoId
    };
    const s3 = new S3Client({ region: 'us-east-1' })
    const command = new PutObjectCommand(s3Params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    await new DynamoDBStorage().generateUploadUrl(userId, todoId, bucketName);
    return signedUrl;
}