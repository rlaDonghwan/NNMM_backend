import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())

  const port = process.env.PORT ?? 4000
  const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000']

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  })

  await app.listen(port)
  console.log(`🚀 Server running on port ${port}`)
  console.log(`✅ CORS allowed origins: ${corsOrigin}`)
}
bootstrap()
