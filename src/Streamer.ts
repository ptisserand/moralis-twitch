import { spawn } from 'child_process';

class Streamer {
    running: boolean;
    child: any = null;

    constructor() {
        this.running = false;
    }

    async start() {
        if (true === this.running) {
            return;
        }
        console.log("Start streaming");
        this.running = true;
        this.child = spawn("./cmd/stream.sh");
        this.child.on('error', (error: any) => {
            console.error(`error: ${error.message}`);
        });

        this.child.stderr.on('data', (data: any) => {
            console.log(`stderr: ${data}`);
        });
    }

    async stop() {
        if (false === this.running) {
            return;
        }
        console.log("Stop streaming");
        if ((null !== this.child) && (false === this.child.killed)) {
            console.log("Send 'q'")
            this.child.stdin.write("q");
            console.log("Send SIGTERM");
            this.child.kill('SIGTERM');
            if (false === this.child.killed) {
                this.child.kill('SIGKILL');
            }
            this.child = null;
        }
        this.running = false;
    }
}

export { Streamer };
