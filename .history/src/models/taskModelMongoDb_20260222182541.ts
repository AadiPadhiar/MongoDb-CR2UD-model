import { MongoError, Db, MongoClient, Collection } from "mongodb";
import type { Document } from "mongodb";
import { isValid } from "./validateUtils.js";
import { DatabaseError } from "./DatabaseError.js";

let client: MongoClient;
let tasksCollection: Collection<Document> | undefined;

interface Task {
  name: string;
  description: string;
  pay: number;
  estimatedTimeInMins: number;
}

async function initialize(dbName: string, resetFlag: boolean): Promise<void> {
  try {
    const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
    client = new MongoClient(url); // store connected client for use while the app is running
    await client.connect();

    const db: Db = client.db(dbName);

    if (resetFlag) {
      const collections = await db.listCollections({ name: "tasks" }).toArray();
      if (collections.length > 0) {
        await db.collection("tasks").drop();
      }
    }
    tasksCollection = db.collection<Document>("tasks");

    console.log("Connected to MongoDB:", dbName);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      throw new DatabaseError("Initialize failed");
    }
  }
}
