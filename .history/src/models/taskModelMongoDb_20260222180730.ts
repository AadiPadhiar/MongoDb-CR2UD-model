import { MongoError, Db, MongoClient, Collection } from "mongodb";
import type { Document } from "mongodb";
import { isValid } from "./validateUtils.js";

let client: MongoClient;
let tasksCollection: Collection<Document> | undefined;

interface Task {
  name: string;
  description: string;
  pay: number;
  estimatedTimeInMins: number;
}
