import { getInputForDay, presentDayResults } from "../utils";

const DAY = 4;
type ParsedInput = Array<{
  winningNumbers: Set<number>;
  numbers: Set<number>;
}>;

const CARD_REGEX = /Card[ ]+\d+: ([\d ]+) \| ([\d ]+)/;
const CARD_NUMBER_REGEX = /(\d+)/g;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => {
    const match = CARD_REGEX.exec(line);

    if (!match) {
      throw new Error(`Invalid line: ${line}`);
    }

    return {
      winningNumbers: new Set(match[1].match(CARD_NUMBER_REGEX)?.map(Number)),
      numbers: new Set(match[2].match(CARD_NUMBER_REGEX)?.map(Number)),
    };
  });
}

function part1(input: ParsedInput) {
  return input.reduce((acc, { numbers, winningNumbers }) => {
    const matches = [...numbers].filter((number) => winningNumbers.has(number));

    const score = matches.length === 0 ? 0 : Math.pow(2, matches.length - 1);

    return acc + score;
  }, 0);
}

function part2(input: ParsedInput) {
  const cardCounts = new Array(input.length).fill(1);

  input.map(({ numbers, winningNumbers }, cardIndex) => {
    const count = cardCounts[cardIndex];

    const matches = [...numbers].filter((number) => winningNumbers.has(number));

    for (let i = 1; i <= matches.length; i++) {
      cardCounts[cardIndex + i] += count;
    }
  });

  return cardCounts.reduce((acc, count) => acc + count, 0);
}

presentDayResults(DAY, getInput, part1, part2);
