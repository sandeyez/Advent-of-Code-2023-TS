import {
  arePointsEqual,
  createGrid,
  getInputForDay,
  getPointNeighbours,
  pointToString,
  presentDayResults,
  type Grid,
  type Point,
} from "../utils";

const DAY = 10;
type ParsedInput = {
  grid: Grid<Pipe | "S" | null>;
  start: Point;
};

type Pipe = "|" | "-" | "L" | "J" | "7" | "F";

const getPipeEndPointsMap: Record<Pipe, (point: Point) => [Point, Point]> = {
  "-": (point) => [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
  ],
  "|": (point) => [
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 },
  ],
  L: (point) => [
    { x: point.x, y: point.y - 1 },
    { x: point.x + 1, y: point.y },
  ],
  J: (point) => [
    { x: point.x, y: point.y - 1 },
    { x: point.x - 1, y: point.y },
  ],
  "7": (point) => [
    { x: point.x, y: point.y + 1 },
    { x: point.x - 1, y: point.y },
  ],
  F: (point) => [
    { x: point.x, y: point.y + 1 },
    { x: point.x + 1, y: point.y },
  ],
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  let startingPoint: Point | null = null;

  const grid = createGrid<(Pipe | "S") | null>(lines, (char, x, y) => {
    if (char === "S") {
      startingPoint = { x, y };
      return "S";
    }

    if (char === ".") {
      return null;
    }

    return char as Pipe;
  });

  if (!startingPoint) {
    throw new Error("Starting point not found");
  }

  return {
    grid,
    start: startingPoint,
  };
}

function getLoopPipeLocations(grid: Grid<Pipe | "S" | null>, start: Point) {
  let point = { ...start };
  let prevPoint = { ...start };

  const visitedPoints = [];

  while (!arePointsEqual(point, start) || visitedPoints.length === 0) {
    const pipe = grid[point.y]?.[point.x];

    if (!pipe) {
      throw new Error("Got off the pipes");
    }

    const pipeEndings =
      pipe === "S"
        ? getPointNeighbours(point)
        : getPipeEndPointsMap[pipe](point);

    const neighbours = getPointNeighbours(point);

    const nextNeighbour = neighbours.find(({ x, y }) => {
      const pipe = grid[y]?.[x];

      if (!pipe) return false;

      if (prevPoint.x === x && prevPoint.y === y) return false;

      if (!pipeEndings.some((end) => arePointsEqual(end, { x, y })))
        return false;

      const neighbourEndings =
        pipe === "S"
          ? getPointNeighbours({ x, y })
          : getPipeEndPointsMap[pipe]({ x, y });

      return neighbourEndings.some((end) => arePointsEqual(end, point));
    });

    if (!nextNeighbour) {
      throw new Error("No next neighbour found");
    }

    prevPoint = { ...point };
    point = { ...nextNeighbour };

    visitedPoints.push(point);
  }

  return visitedPoints;
}

function part1({ grid, start }: ParsedInput) {
  return getLoopPipeLocations(grid, start).length / 2;
}

function part2({ grid, start }: ParsedInput) {
  const loopPoints = new Set(
    getLoopPipeLocations(grid, start).map((point) => pointToString(point))
  );

  const startingPipe = (() => {
    const startingPointNeighbours = getPointNeighbours(start);

    return Object.keys(getPipeEndPointsMap).find((val) =>
      getPipeEndPointsMap[val as Pipe](start).every((point) =>
        startingPointNeighbours
          .filter(({ x, y }) => {
            const pipe = grid[y]?.[x];

            if (!pipe || pipe === "S") return false;

            const pipeEndings = getPipeEndPointsMap[pipe]({ x, y });

            return pipeEndings.some((end) => arePointsEqual(end, start));
          })
          .some((neighbourPoint) => arePointsEqual(neighbourPoint, point))
      )
    ) as Pipe | undefined;
  })();

  if (!startingPipe) {
    throw new Error("Starting pipe not found");
  }

  grid[start.y][start.x] = startingPipe;

  const interiorPoints = grid.reduce((rowAcc, row, y) => {
    // Scanline algorithm
    let prevCorner: Extract<Pipe, "L" | "J" | "7" | "F"> | null = null;
    let isInterior = false;

    return (
      rowAcc +
      row.reduce((acc, cell, x) => {
        // No S-cells are present anymore, so this line is just there to satisfy the type checker
        if (cell === "S") return acc;

        if (!loopPoints.has(pointToString({ x, y }))) {
          if (isInterior) {
            return acc + 1;
          }

          return acc;
        }

        if (cell === "-") return acc;

        if (cell === "|") {
          isInterior = !isInterior;
          return acc;
        }

        if (!prevCorner) {
          prevCorner = cell;
          return acc;
        }

        // U-turn
        if (
          (prevCorner === "F" && cell === "7") ||
          (prevCorner === "L" && cell === "J")
        ) {
          prevCorner = null;
          return acc;
        }

        isInterior = !isInterior;
        prevCorner = null;

        return acc;
      }, 0)
    );
  }, 0);

  return interiorPoints;
}

presentDayResults(DAY, getInput, part1, part2);
