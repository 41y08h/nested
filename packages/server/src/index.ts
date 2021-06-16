import express from 'express'
import createAPIRouter from './lib/createAPIRouter'
import { test } from '@nested/common'

async function main() {
  test()
  const app = express()

  app.use(express.json())

  const api = createAPIRouter()
  app.use(api)

  app.listen(5000)
  console.log('ready on port 5000')
}

main()
