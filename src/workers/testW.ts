import axios from 'axios';
import { parentPort } from 'worker_threads';

axios.get('http://localhost:3000');

parentPort.postMessage(`Send new articles to `);
