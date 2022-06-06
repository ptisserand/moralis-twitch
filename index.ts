import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Streamer } from './src/Streamer';
import { Deadline } from './src/Deadline';

dotenv.config();

let timeout: any = null;

const offset = 5000; // 5s offset
const app: Express = express();
const port = process.env.PORT;

const streamer = new Streamer();
const deadline_watcher = new Deadline();

const handle_deadline_expired = async () => {
    console.log("Deadline expired!");
    streamer.stop();
}

const handle_deadline = (deadline: number) => {
    let deadline_ms = deadline * 1000;
    let delta = deadline_ms - Date.now() + offset;
    console.log("Delta:", delta);
    if (delta <= 0) {
        console.log("Deadline expired");
        handle_deadline_expired();
    } else {
        streamer.start();
        if (null !== timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(handle_deadline_expired, delta);
    }

}

app.get('/', (req: Request, resp: Response) => {
    resp.send('Express + Typescript server');
})

app.get('/deadline/:timestamp', (req: Request, resp: Response) => {
    console.log("New deadline:", req.params.timestamp);
    let deadline = parseInt(req.params.timestamp);
    handle_deadline(deadline);
    resp.send('OK');
})

app.listen(port, async () => {
    await deadline_watcher.init();
    await deadline_watcher.run(handle_deadline);
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


