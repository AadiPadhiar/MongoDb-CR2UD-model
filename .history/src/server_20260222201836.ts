import { createServer, IncomingMessage, ServerResponse } from "http";
const model = import("./models/taskModelMongoDb.js");
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
//     try{
//         const result: Task = await model.addTask(task);

// async function handleGetSingleTask(name: string): Promise<string> {
//     try{
//         const result: Task = await model.getSingleTask(name);
//         return "Successfully found task: '" + result.name + "' description: '" + result.description + "' pay: '" + result.pay + "' estimatedTimeInMins: '" + result.estimatedTimeInMins + "'\n";
//     } catch (err: unknown)
// }

createServer(async function (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.write(
    await handleAddTask({
      name: "test",
      description: "This is a test task",
      pay: 10,
      estimatedTimeInMins: 30,
    }),
  );
  response.end("Hello World <yourname>");
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
