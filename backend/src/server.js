import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`LinkFlow Pro API running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
