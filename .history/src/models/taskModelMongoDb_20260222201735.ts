import { MongoError, Db, MongoClient, Collection } from "mongodb";
import type { Document } from "mongodb";
import { isValid } from "./validateUtils.js";
import { DatabaseError } from "./DatabaseError.js";

let client: MongoClient;
let tasksCollection: Collection<Task> | undefined;

interface Task {
  name: string;
  description: string;
  pay: number;
  estimatedTimeInMins: number;
}

async function initialize(
  dbName: string,
  resetFlag: boolean,
  collection: string,
): Promise<void> {
  try {
    const url = `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`;
    client = new MongoClient(url); // store connected client for use while the app is running
    await client.connect();

    const db: Db = client.db(dbName);

    if (resetFlag) {
      const collections = await db
        .listCollections({ name: collection })
        .toArray();
      if (collections.length > 0) {
        await db.collection(collection).drop();
      }
    }
    tasksCollection = db.collection<Task>(collection);

    console.log("Connected to MongoDB:", dbName);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      throw new DatabaseError("Initialize failed");
    }
  }
}

async function addTask(task: Task): Promise<Task>{
    if (!tasksCollection) {
        throw new DatabaseError("Collection not initialized");
    }
    try{
        isValid(task.name, task.description, task.pay, task.estimatedTimeInMins);
        await tasksCollection.insertOne(task);
        return task;
    } catch (err: unknown) {
        if (err instanceof DatabaseError) {
            throw err;
        } else if (err instanceof Error) {
            console.log(err.message);
            throw new DatabaseError(err.message);
        } else {
            throw new DatabaseError(
                "An unknown error occurred in addTask. Should not happen",
            );
        }
    }
}

async function getSingleTask(name: string): Promise<Task> {
  if (!tasksCollection) {
    throw new DatabaseError("Collection not initialized");
  }
  try {
    isValid(name, "validDescription", 1, 1); //calling to see if name is valid, other parameters are dummy and not used in validation
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

async function updateTask(name: string, task: Task): Promise<Task> {
  if (!tasksCollection) {
    throw new DatabaseError("Collection not initialized");
  }
  try {
    isValid(task.name, task.description, task.pay, task.estimatedTimeInMins);
    const result = await tasksCollection.findOneAndUpdate(
      { name },
      {
        $set: {
          name: task.name,
          description: task.description,
          pay: task.pay,
          estimatedTimeInMins: task.estimatedTimeInMins,
        },
      },
      { returnDocument: "after" },
    );
    if (!result) {
      throw new DatabaseError(
        "Update failed, no task found with the given name",
      );
    }
    return result as Task;
  } catch (err: unknown) {
    if (err instanceof DatabaseError) {
      throw err;
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new DatabaseError(err.message);
    } else {
      throw new DatabaseError(
        "An unknown error occurred in updateTask. Should not happen",
      );
    }
  }
}

async function deleteTask(name: string): Promise<void> {
  if (!tasksCollection) {
    throw new DatabaseError("Collection not initialized");
  }
  try {
    isValid(name, "validDescription", 1, 1); // Validate name, other parameters are dummy
    const result = await tasksCollection.deleteOne({ name });
    if (result.deletedCount === 0) {
      throw new DatabaseError(
        "Delete failed, no task found with the given name",
      );
    }
  } catch (err: unknown) {
    if (err instanceof DatabaseError) {
      throw err;
    } else if (err instanceof Error) {
      console.log(err.message);
      throw new DatabaseError(err.message);
    } else {
      throw new DatabaseError(
        "An unknown error occurred in deleteTask. Should not happen",
      );
    }
  }
}
async function close(): Promise<void> {
  if (client) {
    await client.close();
  }
}
module.exports = {
  initialize,
    addTask,
  getSingleTask,
  getAllTasks,
  updateTask,
  deleteTask,
  close,
};
export type { Task };
