import { getInputForDay, presentDayResults } from "../utils";

const DAY = 9;
type ParsedInput = number[][];

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => line.split(" ").map((n) => parseInt(n, 10)));
}

function part1(input: ParsedInput) {
  return input.reduce((acc, numbers) => {
    const layers: number[][] = [numbers];

    while (layers.at(-1)?.some((n) => n !== 0)) {
      const layer = layers.at(-1);

      if (!layer) {
        throw new Error("Invalid input");
      }

      const newLayer: number[] = [];

      for (let i = 1; i < layer.length; i++) {
        newLayer.push(layer[i] - layer[i - 1]);
      }

      layers.push(newLayer);
    }

    let value = 0;

    for (let i = layers.length - 2; i >= 0; i--) {
      value += layers[i].at(-1)!;
    }

    return acc + value;
  }, 0);
}

function part2(input: ParsedInput) {
  return input.reduce((acc, numbers) => {
    const layers: number[][] = [numbers];

    while (layers.at(-1)?.some((n) => n !== 0)) {
      const layer = layers.at(-1);

      if (!layer) {
        throw new Error("Invalid input");
      }

      const newLayer: number[] = [];

      for (let i = 1; i < layer.length; i++) {
        newLayer.push(layer[i] - layer[i - 1]);
      }

      layers.push(newLayer);
    }

    let value = 0;

    for (let i = layers.length - 2; i >= 0; i--) {
      value = layers[i][0]! - value;
    }

    return acc + value;
  }, 0);

  return "Not implemented";
}

presentDayResults(DAY, getInput, part1, part2);
