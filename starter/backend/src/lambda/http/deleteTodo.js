import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from "../utils.mjs";
import { deleteTodo } from "../../services/deleteTodo.js";

const logger = createLogger('deleteTodo')
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const jwtToken = getUserId(event);
  await deleteTodo(jwtToken, todoId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: undefined
  }
}

