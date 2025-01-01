import { getInputForDay, isDigit, presentDayResults } from "../utils";

const DAY = 5;

type MappingLayer = {
  sourceStart: number;
  change: number;
  length: number;
};
type ParsedInput = {
  seeds: number[];
  mappings: Array<MappingLayer[]>;
};

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const seeds: number[] = [];
  const mappings: Array<MappingLayer[]> = [];

  lines.forEach((line, i) => {
    if (i === 0) {
      seeds.push(...line.split("seeds: ")[1].split(" ").map(Number));
      return;
    }

    if (line === "") {
      mappings.push([]);
      return;
    }

    if (!isDigit(line[0])) return;

    const [destinationStart, sourceStart, length] = line.split(" ").map(Number);

    mappings[mappings.length - 1].push({
      sourceStart,
      change: destinationStart - sourceStart,
      length,
    });
  });

  return {
    seeds,
    mappings,
  };
}

function part1({ mappings, seeds }: ParsedInput) {
  return Math.min(
    ...mappings.reduce(
      (acc, mapping) =>
        acc.map((value) => {
          const rule = mapping.find(
            ({ sourceStart, length }) =>
              value >= sourceStart && value < sourceStart + length
          );

          if (!rule) return value;

          return value + rule.change;
        }),
      seeds
    )
  );
}

function part2({ seeds, mappings }: ParsedInput) {
  type SeedRange = {
    start: number;
    end: number;
  };
  const seedRanges: SeedRange[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i];
    const length = seeds[i + 1];

    seedRanges.push({
      start,
      end: start + length,
    });
  }

  const finalRanges = mappings.reduce((seedAcc, mappingLayer) => {
    let seedRangesLeft = [...seedAcc];
    const newSeedRanges: SeedRange[] = [];

    mappingLayer.forEach(({ sourceStart, change, length }) => {
      const affectedRanges = seedRangesLeft.filter(({ start, end }) => {
        return (
          (end >= sourceStart && end <= sourceStart + length) ||
          (start >= sourceStart && start <= sourceStart + length)
        );
      });

      if (affectedRanges.length === 0) return;

      affectedRanges.forEach(({ start, end }) => {
        seedRangesLeft = seedRangesLeft.filter(
          (range) => range.start !== start && range.end !== end
        );

        const affectedPart: SeedRange = {
          start: Math.max(start, sourceStart),
          end: Math.min(end, sourceStart + length - 1),
        };

        newSeedRanges.push({
          start: affectedPart.start + change,
          end: affectedPart.end + change,
        });

        if (start < affectedPart.start)
          seedRangesLeft.push({ start, end: affectedPart.start - 1 });
        if (end > affectedPart.end)
          seedRangesLeft.push({ start: affectedPart.end + 1, end });
      });
    });

    return [...seedRangesLeft, ...newSeedRanges];
  }, seedRanges);

  return Math.min(...finalRanges.map(({ start }) => start));
}

presentDayResults(DAY, getInput, part1, part2);
