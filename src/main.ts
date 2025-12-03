import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './lib/constants.js';
import { uploadPath } from './middleware/imageUploader.js';
import { errorHandler } from './middleware/errorController.js';
import router from './router/index.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(router);
app.use('/upload', express.static(uploadPath));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
