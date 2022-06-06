class Streamer {
    running: boolean;

    constructor() {
        this.running = false;
    }

    async start() {
        if (true === this.running) {
            return;
        }
        console.log("Start streaming");
        this.running = true;
    }

    async stop() {
        if (false === this.running) {
            return;
        }
        console.log("Stop streaming");
        this.running = false;
    }
}

export { Streamer };
