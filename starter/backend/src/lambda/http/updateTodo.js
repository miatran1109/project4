import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from "../utils.mjs";
import { updateTodo } from "../../services/editTodo.js";

const logger = createLogger('updateTodo')

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const jwtToken = getUserId(event);

  await updateTodo(jwtToken, todoId, updatedTodo)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
  },
    body: undefined
  };
}
