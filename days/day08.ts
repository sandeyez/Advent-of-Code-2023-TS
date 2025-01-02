import {
  getInputForDay,
  leastCommonMultiple,
  presentDayResults,
} from "../utils";

const DAY = 8;

type LeftOrRight = "L" | "R";
type ParsedInput = {
  network: Map<string, [string, string]>;
  route: LeftOrRight[];
};

const NODE_REGEX = /([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  const route = lines[0].split("") as LeftOrRight[];
  const network = lines.slice(2).reduce((acc, line) => {
    const [_, node, left, right] = line.match(NODE_REGEX) || [];

    if (!node || !left || !right) {
      throw new Error("Invalid input");
    }

    acc.set(node, [left, right]);

    return acc;
  }, new Map<string, [string, string]>());

  return {
    route,
    network,
  };
}

const START_NODE = "AAA";
const END_NODE = "ZZZ";

function part1({ network, route }: ParsedInput) {
  let node = START_NODE;

  let step = 0;

  while (node !== END_NODE) {
    const [left, right] = network.get(node)!;

    const direction = route[step % route.length];

    node = direction === "L" ? left : right;

    step++;
  }

  return step;
}

function part2({ network, route }: ParsedInput) {
  const startingNodes = Array.from(network.keys()).filter((node) =>
    node.endsWith("A")
  );

  const cycleLengths = startingNodes.map((node) => {
    let step = 0;
    let currentNode = node;

    while (!currentNode.endsWith("Z")) {
      const instruction = route[step % route.length];
      const [left, right] = network.get(currentNode)!;

      currentNode = instruction === "L" ? left : right;
      step++;
    }

    return step;
  });

  return cycleLengths.reduce(leastCommonMultiple, 1);
}

presentDayResults(DAY, getInput, part1, part2);
