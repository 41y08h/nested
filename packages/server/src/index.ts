import express from 'express'
import createAPIRouter from './lib/createAPIRouter'
import common from 'common'

async function main() {
  console.log(common)
  const app = express()

  app.use(express.json())

  const api = createAPIRouter()
  app.use(api)

  app.listen(5000)
  console.log('ready on port 5000')
}

main()
