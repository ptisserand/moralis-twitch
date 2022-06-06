import Moralis from 'moralis/node';
import dotenv from 'dotenv';

dotenv.config();

require("dotenv").config();

/* Moralis init code */
const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;


class Deadline {
    deadline: any = null;
    subscription: any = null;

    async init() {
        await Moralis.start({ serverUrl, appId, masterKey });
        this.deadline = Moralis.Object.extend("Deadline");
    }
    async find() {
        const query = new Moralis.Query(this.deadline);
        const results = await query.find();
        return results;
    }

    async run(callback: any) {
        const query = new Moralis.Query(this.deadline);
        let subscription = await query.subscribe();
        // console.log(subscription);
        subscription.on("open", () => {
            console.log("subscription opened");
        })
        subscription.on("close", () => {
            console.log("Subscription closed");
        })
        subscription.on("create", (object: any) => {
            console.log("Object created:", JSON.stringify(object));
        })
        subscription.on("update", (object: any) => {
            console.log("New deadline:", object.get("timestamp"));
            callback(parseInt(object.get("timestamp")));
        })
    }
}

export { Deadline };
