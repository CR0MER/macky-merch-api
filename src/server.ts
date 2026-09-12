import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Macky Merch API listening on port ${env.PORT}`);
});
