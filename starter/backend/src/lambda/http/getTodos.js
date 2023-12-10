import { createLogger } from '../../utils/logger.mjs'
import { getTodos } from '../../services/getTodos.js';
import { getUserId } from '../utils.mjs';

const logger = createLogger('getTodos')

export const handler = async (event) => {
  const jwtToken = getUserId(event);
  const items = await getTodos(jwtToken);
  logger.info('Getting all TODO items: ' + JSON.stringify(items))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(items)
  }
}
