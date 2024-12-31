import { getInputForDay, presentDayResults } from "../utils";

const DAY = 2;
type ParsedInput = Array<{
  id: number;
  cubes: Array<{
    red: number;
    green: number;
    blue: number;
  }>;
}>;

const GAME_ID_REGEX = /Game (\d+): (.*)/;

const RED_REGEX = /(\d+) red/;
const GREEN_REGEX = /(\d+) green/;
const BLUE_REGEX = /(\d+) blue/;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => {
    const gameMatch = line.match(GAME_ID_REGEX)!;

    const gameID = parseInt(gameMatch[1], 10);

    const cubes = gameMatch[2].split("; ").map((cube) => {
      const redMatch = cube.match(RED_REGEX);
      const greenMatch = cube.match(GREEN_REGEX);
      const blueMatch = cube.match(BLUE_REGEX);

      return {
        red: redMatch ? parseInt(redMatch[1], 10) : 0,
        green: greenMatch ? parseInt(greenMatch[1], 10) : 0,
        blue: blueMatch ? parseInt(blueMatch[1], 10) : 0,
      };
    });

    return {
      id: gameID,
      cubes,
    };
  });
}

const RED_COUNT = 12;
const GREEN_COUNT = 13;
const BLUE_COUNT = 14;

function part1(input: ParsedInput) {
  return input.reduce((acc, { id, cubes }) => {
    const possible = cubes.every(
      ({ blue, green, red }) =>
        red <= RED_COUNT && green <= GREEN_COUNT && blue <= BLUE_COUNT
    );

    return possible ? acc + id : acc;
  }, 0);
}

function part2(input: ParsedInput) {
  return input.reduce((acc, { id, cubes }) => {
    const minRed = Math.max(...cubes.map(({ red }) => red));
    const minGreen = Math.max(...cubes.map(({ green }) => green));
    const minBlue = Math.max(...cubes.map(({ blue }) => blue));

    return (
      acc + Math.max(1, minRed) * Math.max(1, minGreen) * Math.max(1, minBlue)
    );
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
