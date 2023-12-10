import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from "../utils.mjs";
import { createTodo } from "../../services/createTodo.js";

const logger = createLogger('createTodo')

export async function handler(event) {
  const newTodo = JSON.parse(event.body);
  const jwtToken = getUserId(event);
  logger.info('Creating new TODO item', { ...newTodo, jwtToken });
  
  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({item: await createTodo(newTodo, jwtToken)})
}
}

