import { getInputForDay, presentDayResults } from "../utils";

const DAY = undefined;
type ParsedInput = string[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines;
}

function part1(input: ParsedInput) {
  console.log(input);

  return "Not implemented";
}

function part2(input: ParsedInput) {
  return "Not implemented";
}

presentDayResults(DAY, getInput, part1, part2);
