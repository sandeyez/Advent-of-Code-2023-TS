import {
  addPoints,
  createGrid,
  getInputForDay,
  getPointNeighbours,
  isDigit,
  pointToString,
  presentDayResults,
  type Grid,
  type Point,
  type StringifiedPoint,
} from "../utils";

const DAY = 3;
type ParsedInput = {
  numbers: Array<[number, Point]>;
  parts: Array<[string, Point]>;
  grid: Grid<string>;
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const numbers: ParsedInput["numbers"] = [];
  const parts: ParsedInput["parts"] = [];

  let currentNumber = 0;
  let currentPoint: Point | undefined = undefined;

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];

      if (isDigit(char)) {
        currentNumber = 10 * currentNumber + parseInt(char, 10);
        if (!currentPoint) currentPoint = { x, y };

        continue;
      } else {
        if (currentPoint) {
          numbers.push([currentNumber, currentPoint]);
          currentNumber = 0;
          currentPoint = undefined;
        }
      }

      if (char === ".") continue;

      parts.push([char, { x, y }]);
    }
    if (currentPoint) {
      numbers.push([currentNumber, currentPoint]);
      currentNumber = 0;
      currentPoint = undefined;
    }
  }
  if (currentPoint) {
    numbers.push([currentNumber, currentPoint]);
    currentNumber = 0;
    currentPoint = undefined;
  }

  return {
    numbers,
    parts,
    grid: createGrid(lines),
  };
}

function part1({ numbers, parts }: ParsedInput) {
  const partPoints = new Set(parts.map(([, point]) => pointToString(point)));

  return numbers.reduce((acc, [number, point]) => {
    const numberLength = Math.floor(Math.log10(number)) + 1;

    const neighbourPoints: Point[] = [];

    for (let i = -1; i <= numberLength; i++) {
      const neighbourPoint = addPoints(point, { x: i, y: 0 });

      if (i < 0 || i === numberLength) neighbourPoints.push(neighbourPoint);

      const topPoint = addPoints(neighbourPoint, { x: 0, y: -1 });
      const bottomPoint = addPoints(neighbourPoint, { x: 0, y: 1 });

      neighbourPoints.push(topPoint, bottomPoint);
    }

    const isAdjacent = neighbourPoints.some((point) =>
      partPoints.has(pointToString(point))
    );

    return isAdjacent ? acc + number : acc;
  }, 0);
}

function part2({ grid, parts }: ParsedInput) {
  const gears = parts
    .filter(([part]) => part === "*")
    .map(([, point]) => point);

  return gears.reduce((acc, gear) => {
    const neighbourPoints = getPointNeighbours(gear, true);

    const startingPoints = new Set<StringifiedPoint>();

    const neighbourNumbers = neighbourPoints.reduce<number[]>((acc, point) => {
      const char = grid[point.y]?.[point.x];

      if (!char || !isDigit(char)) return acc;

      const moveLeftDirection: Point = { x: -1, y: 0 };
      const moveRightDirection: Point = { x: 1, y: 0 };

      const leftPoint = addPoints(point, moveLeftDirection);
      const rightPoint = addPoints(point, moveRightDirection);

      while (isDigit(grid[leftPoint.y]?.[leftPoint.x])) {
        leftPoint.x -= 1;
      }

      while (isDigit(grid[rightPoint.y]?.[rightPoint.x])) {
        rightPoint.x += 1;
      }

      if (startingPoints.has(pointToString(leftPoint))) return acc;

      startingPoints.add(pointToString(leftPoint));

      const number = grid[point.y]
        .slice(leftPoint.x + 1, rightPoint.x)
        .join("");

      return [...acc, parseInt(number, 10)];
    }, []);

    if (neighbourNumbers.length !== 2) return acc;

    const [first, second] = Array.from(neighbourNumbers);

    return acc + first * second;
  }, 0);
}

presentDayResults(DAY, getInput, part1, part2);
