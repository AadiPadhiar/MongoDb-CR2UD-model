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

async function getSingleTask(name: string): Promise<Task> {
  if (!tasksCollection) {
    throw new DatabaseError("Collection not initialized");
  }
  try {
    const match = await tasksCollection.findOne<Task>({ name: name });
    if (!match) {
      throw new DatabaseError("Find result was null");
    }
    return match;
  } catch (err: unknown) {
    if (err instanceof DatabaseError) {
      throw err;
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new DatabaseError(err.message);
    } else {
      throw new DatabaseError(
        "An unknown error occurred in getSingleTask. Should not happen",
      );
    }
  }
}

async function getAllTasks(): Promise<Task[]> {
  if (!tasksCollection) {
    throw new DatabaseError("Collection not initialized");
  }
  try {
    const cursor = await tasksCollection.find<Task>({});
    const allTask: Task[] = await cursor.toArray();
    return allTask;
  } catch (err: unknown) {
    if (err instanceof DatabaseError) {
      throw err;
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new DatabaseError(err.message);
    } else {
      throw new DatabaseError(
        "An unknown error occurred in getAllTasks. Should not happen",
      );
    }
  }
}

async function updateTask(name:string, newName: string): Promise<Task>{
    if (!tasksCollection) {
        throw new DatabaseError("Collection not initialized");
    }
    try {
        
}
