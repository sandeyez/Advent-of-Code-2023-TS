import { getInputForDay, presentDayResults } from "../utils";

const DAY = 6;
type ParsedInput = Array<{
  time: number;
  distance: number;
}>;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const timeDigits = lines[0].match(/\d+/g);
  const distanceDigits = lines[1].match(/\d+/g);

  if (!timeDigits || !distanceDigits) {
    throw new Error("Invalid input");
  }

  return timeDigits.map((time, i) => ({
    time: Number(time),
    distance: Number(distanceDigits[i]),
  }));
}

function calculateMillimeters(timeHeld: number, totalTime: number) {
  return timeHeld * (totalTime - timeHeld);
}

function part1(input: ParsedInput) {
  return input.reduce((acc, { time, distance }) => {
    let lowerLowerBound = 0;
    let upperLowerBound = time;

    let lowerValue = Math.floor((upperLowerBound + lowerLowerBound) / 2);

    while (
      (calculateMillimeters(lowerValue, time) <= distance ||
        calculateMillimeters(lowerValue - 1, time) > distance) &&
      upperLowerBound - lowerLowerBound > 1
    ) {
      if (calculateMillimeters(lowerValue, time) <= distance) {
        lowerLowerBound = lowerValue;
      } else {
        upperLowerBound = lowerValue;
      }

      lowerValue = Math.floor((upperLowerBound + lowerLowerBound) / 2);
    }

    let lowerUpperBound = lowerValue;
    let upperUpperBound = time;

    let upperValue = Math.floor((upperUpperBound + lowerUpperBound) / 2);

    while (
      (calculateMillimeters(upperValue, time) <= distance ||
        calculateMillimeters(upperValue + 1, time) > distance) &&
      upperUpperBound - lowerUpperBound > 1
    ) {
      if (calculateMillimeters(upperValue, time) <= distance) {
        upperUpperBound = upperValue;
      } else {
        lowerUpperBound = upperValue;
      }

      upperValue = Math.floor((upperUpperBound + lowerUpperBound) / 2);
    }
    const result = upperValue - lowerValue + 1;

    return acc * result;
  }, 1);
}

function part2(input: ParsedInput) {
  const newInput: ParsedInput[number] = {
    time: parseInt(input.map(({ time }) => time).join("")),
    distance: parseInt(input.map(({ distance }) => distance).join("")),
  };

  return part1([newInput]);
}

presentDayResults(DAY, getInput, part1, part2);
