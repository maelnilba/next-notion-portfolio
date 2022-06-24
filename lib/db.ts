import Keyv from '@keyvhq/core'
import KeyvRedis from '@keyvhq/redis'
import { createClient } from 'redis'
import { isRedisEnabled, redisUrl, redisHost, redisPassword } from './config'

let db: any
if (isRedisEnabled) {
  // const keyvRedis = new KeyvRedis(redisUrl)
  let db = createClient({
    url: redisUrl,
    password: redisPassword
  })

  // db = new Keyv({ store: keyvRedis, namespace: redisNamespace || undefined })
} else {
  db = createClient()
}

export { db }
