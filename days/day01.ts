import { getInputForDay, isDigit, presentDayResults } from "../utils";

const DAY = 1;
type ParsedInput = string[];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines;
}

function part1(input: ParsedInput) {
  return input.reduce((acc, line) => {
    const lineNumbers = line
      .split("")
      .filter(isDigit)
      .map((num) => parseInt(num, 10));

    if (lineNumbers.length === 0) {
      return acc;
    }

    const num = 10 * lineNumbers[0] + lineNumbers.at(-1)!;

    return acc + num;
  }, 0);
}

const numbersInText = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function part2(input: ParsedInput) {
  return input.reduce((acc, line) => {
    let l = 0;
    let r = line.length - 1;

    let lQueue = "";
    let rQueue = "";

    let lValue: number | undefined = undefined;
    let rValue: number | undefined = undefined;

    while (lValue === undefined || rValue === undefined) {
      if (lValue === undefined) {
        const value = line[l];
        lQueue += value;

        if (isDigit(value)) {
          lValue = parseInt(value, 10);
        } else {
          const idx = numbersInText.findIndex((num) => lQueue.endsWith(num));

          if (idx >= 0) {
            lValue = idx + 1;
            lQueue = "";
          }
        }
      }

      if (rValue === undefined) {
        const value = line[r];
        rQueue = `${value}${rQueue}`;

        if (isDigit(value)) {
          rValue = parseInt(value, 10);
        } else {
          const idx = numbersInText.findIndex((num) => rQueue.startsWith(num));

          if (idx >= 0) {
            rValue = idx + 1;
          }
        }
      }

      if (lValue === undefined) l++;
      if (rValue === undefined) r--;

      if (l > r) {
        break;
      }
    }

    if (lValue === undefined || rValue === undefined) {
      const value = lValue ?? rValue;

      if (!value) {
        throw new Error("No value found");
      }

      const num = value * 11;

      return acc + num;
    }

    const num = 10 * lValue + rValue;

    return acc + num;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
