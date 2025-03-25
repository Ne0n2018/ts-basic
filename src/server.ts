import app from './app';
import { PORT } from './common/config';

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
