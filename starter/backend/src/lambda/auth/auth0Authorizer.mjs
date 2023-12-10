import Axios from 'axios'
import jsonwebtoken, { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-gnmnuwa1ynu5m7bg.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const keys = (await Axios.get(jwksUrl)).data.keys;
  const signingKey = keys.find(key => key.kid === jwt.header.kid);
  logger.info('Signing key', { signingKey });
  if (!signingKey) throw new Error('Invalid signing key');
  const secret = signingKey.x5c[0];
  const cert = `-----BEGIN CERTIFICATE----- ${secret} -----END CERTIFICATE-----`
  const verifiedToken = verify(token, cert, { algorithms: ['RS256'] })
  logger.info('Token verified', verifiedToken)
  return verifiedToken;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
