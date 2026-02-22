import validator from "validator";
import { InvalidInputError } from "./InvalidInputError.js";
import { InvalidatedProjectKind } from "typescript";
/**
 * Check to see if the given name is non-empty and comprised of
 * only letters, and the given type is one of the valid 6 types
 * @param {string} name
 * @param {string} type
 * @returns true if both name and type are valid.
 * @throws InvalidInputError if name or type is invalid
 */
function isValid(
  name: string,
  description: string,
  pay: number,
  estimatedTimeInMins: number,
) {
  if (!name || !validator.isAlpha(name)) {
    throw new InvalidInputError("Invalid name");
  }
  if (!description || !validator.isLength(description, { min: 5, max: 200 })) {
    throw new InvalidInputError("Invalid description");
  }
  if (pay <= 0) {
    throw new InvalidInputError("Invalid pay");
  }
  if (estimatedTimeInMins <= 0) {
    throw new InvalidInputError("Invalid estimated time");
  }
}
export { isValid };
