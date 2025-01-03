import { getInputForDay, presentDayResults, type Point } from "../utils";

const DAY = 11;
type ParsedInput = {
  galaxies: Point[];
  size: [number, number];
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const galaxies: Point[] = [];

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === "#") {
        galaxies.push({ x, y });
      }
    }
  }

  return {
    galaxies,
    size: [lines[0].length, lines.length],
  };
}

function getDistanceSumBetweenGalaxiesWithExpansion({
  expansionFactor,
  galaxies,
  size: [sizeX, sizeY],
}: ParsedInput & {
  expansionFactor: number;
}) {
  const rowsToExpand = [];

  for (let y = 0; y < sizeY; y++) {
    if (galaxies.some((galaxy) => galaxy.y === y)) {
      continue;
    }

    rowsToExpand.push(y);
  }

  const columnsToExpand = [];

  for (let x = 0; x < sizeX; x++) {
    if (galaxies.some((galaxy) => galaxy.x === x)) {
      continue;
    }

    columnsToExpand.push(x);
  }

  let distanceSum = 0;

  for (let a = 0; a < galaxies.length; a++) {
    for (let b = a + 1; b < galaxies.length; b++) {
      const galaxyA = galaxies[a];
      const galaxyB = galaxies[b];

      const minX = Math.min(galaxyA.x, galaxyB.x);
      const maxX = Math.max(galaxyA.x, galaxyB.x);

      const columnsToPass = columnsToExpand.filter(
        (column) => column > minX && column < maxX
      );

      const minY = Math.min(galaxyA.y, galaxyB.y);
      const maxY = Math.max(galaxyA.y, galaxyB.y);

      const rowsToPass = rowsToExpand.filter((row) => row > minY && row < maxY);

      const xGap = maxX - minX;
      const yGap = maxY - minY;

      distanceSum +=
        xGap +
        yGap +
        (columnsToPass.length + rowsToPass.length) * (expansionFactor - 1);
    }
  }

  return distanceSum;
}

function part1({ galaxies, size: [sizeX, sizeY] }: ParsedInput) {
  return getDistanceSumBetweenGalaxiesWithExpansion({
    galaxies,
    size: [sizeX, sizeY],
    expansionFactor: 2,
  });
}

function part2({ galaxies, size: [sizeX, sizeY] }: ParsedInput) {
  return getDistanceSumBetweenGalaxiesWithExpansion({
    galaxies,
    size: [sizeX, sizeY],
    expansionFactor: 1_000_000,
  });
}

presentDayResults(DAY, getInput, part1, part2);
