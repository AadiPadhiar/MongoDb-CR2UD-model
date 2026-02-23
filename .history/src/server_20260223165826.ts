import { createServer, IncomingMessage, ServerResponse } from "http";
import * as model from "./models/taskModelMongoDb.js";
import type { Task } from "./models/taskModelMongoDb.js";
const port: number = 1339;
const initialized = model.initialize("tasksDb", true, "tasks");

async function handleAddTask(task: Task): Promise<string> {
  try {
    const result: Task = await model.addTask(task);
    return "Successfully added task: '" + result.name + "'\n";
  } catch (err: unknown) {
    if (err instanceof Error) {
      return "Error adding task: " + err.message + "\n";
    } else {
      return "An unknown error occurred while adding task. Should not happen\n";
    }
  }
}
async function handleGetSingleTask(name: string): Promise<string> {
  try {
    const result: Task = await model.getSingleTask(name);
    return (
      "Successfully found task: '" +
      result.name +
      "' description: '" +
      result.description +
      "' pay: '" +
      result.pay +
      "' estimatedTimeInMins: '" +
      result.estimatedTimeInMins +
      "'\n"
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return "Error getting task: " + err.message + "\n";
    } else {
      return "An unknown error occurred while getting task. Should not happen\n";
    }
  }
}
async function handleGetAllTasks(): Promise<string> {
  try {
    const result: Task[] = await model.getAllTasks();
    return (
      "Successfully found tasks: " +
      result.map((task) => task.name).join(", ") +
      "\n"
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return "Error getting tasks: " + err.message + "\n";
    } else {
      return "An unknown error occurred while getting tasks. Should not happen\n";
    }
  }
}
async function handleUpdateTask(name: string, task: Task): Promise<string> {
  try {
    const result: Task = await model.updateTask(name, task);
    return "Successfully updated task: '" + result.name + "'\n";
  } catch (err: unknown) {
    if (err instanceof Error) {
      return "Error updating task: " + err.message + "\n";
    } else {
      return "An unknown error occurred while updating task. Should not happen\n";
    }
  }
}
async function handleDeleteTask(name: string): Promise<string> {
  try {
    await model.deleteTask(name);
    return "Successfully deleted task: '" + name + "'\n";
  } catch (err: unknown) {
    if (err instanceof Error) {
      return "Error deleting task: " + err.message + "\n";
    } else {
      return "An unknown error occurred while deleting task. Should not happen\n";
    }
  }
}

createServer(async function (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.write(
    await handleAddTask({
      name: "",
      description: "This is a test task",
      pay: 10,
      estimatedTimeInMins: 30,
    }),
  );
  response.write(await handleGetSingleTask("test"));
  response.write(
    await handleAddTask({
      name: "cleaning",
      description: "Clean the house",
      pay: 20,
      estimatedTimeInMins: 40,
    }),
  );
  response.write(await handleGetAllTasks());
  response.write(
    await handleUpdateTask("test", {
      name: "newTest",
      description: "This is an updated test task",
      pay: 15,
      estimatedTimeInMins: 35,
    }),
  );
  response.write(await handleDeleteTask("cleaning"));
  response.end("Hello World <Aadi>");
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
