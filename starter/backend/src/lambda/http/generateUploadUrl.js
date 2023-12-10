import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from "../utils.mjs";
import { generateUploadUrl } from "../../services/generateUploadUrl.js";

const logger = createLogger('generateUploadUrl')

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const jwtToken = getUserId(event);
  const signedUrl = await generateUploadUrl(jwtToken, todoId)
  logger.info('signedUrl: ' + signedUrl)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ uploadUrl: signedUrl })
  };
}
