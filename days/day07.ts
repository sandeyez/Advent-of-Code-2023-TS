import { getInputForDay, presentDayResults } from "../utils";

const DAY = 7;

const typeOfCards = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;
type Card = (typeof typeOfCards)[number];

const cardRanksMap = new Map(typeOfCards.map((card, i) => [card, i]));

type ParsedInput = Array<{
  cards: Card[];
  bid: number;
}>;

function getInput(): ParsedInput {
  const lines = getInputForDay(DAY);

  return lines.map((line) => {
    const [cards, bid] = line.split(" ");

    return {
      cards: cards.split("") as Card[],
      bid: Number(bid),
    };
  });
}

const typeOfHands = [
  "five-of-a-kind",
  "four-of-a-kind",
  "full-house",
  "three-of-a-kind",
  "two-pair",
  "one-pair",
  "highest-card",
] as const;
type Hand = (typeof typeOfHands)[number];

const handRanksMap = new Map(typeOfHands.map((hand, i) => [hand, i]));

function compareCards(cards1: Card[], cards2: Card[], index = 0) {
  if (index === cards1.length) {
    return 0;
  }

  const card1 = cards1[index];
  const card2 = cards2[index];

  if (card1 === card2) {
    return compareCards(cards1, cards2, index + 1);
  }

  return cardRanksMap.get(card1)! - cardRanksMap.get(card2)!;
}

function part1(input: ParsedInput) {
  const hands: Array<{
    cards: Card[];
    hand: Hand;
    bid: number;
  }> = input.map(({ cards, bid }) => {
    const occurences = cards.reduce<Record<Card, number>>((acc, card) => {
      acc[card] = (acc[card] || 0) + 1;

      return acc;
    }, {} as Record<Card, number>);

    const entries = Object.entries(occurences);

    if (entries.some(([, count]) => count === 5)) {
      return {
        cards,
        hand: "five-of-a-kind",
        bid,
      };
    }

    if (entries.some(([, count]) => count === 4)) {
      return {
        cards,
        hand: "four-of-a-kind",
        bid,
      };
    }

    if (
      entries.some(([, count]) => count === 3) &&
      entries.some(([, count]) => count === 2)
    ) {
      return {
        cards,
        hand: "full-house",
        bid,
      };
    }

    if (entries.some(([, count]) => count === 3)) {
      return {
        cards,
        hand: "three-of-a-kind",
        bid,
      };
    }

    if (entries.filter(([, count]) => count === 2).length === 2) {
      return {
        cards,
        hand: "two-pair",
        bid,
      };
    }

    if (entries.some(([, count]) => count === 2)) {
      return {
        cards,
        hand: "one-pair",
        bid,
      };
    }

    return {
      cards,
      hand: "highest-card",
      bid,
    };
  });

  return hands
    .sort(({ hand: hand1, cards: cards1 }, { hand: hand2, cards: cards2 }) => {
      if (hand1 !== hand2) {
        return handRanksMap.get(hand1)! - handRanksMap.get(hand2)!;
      }

      return compareCards(cards1, cards2);
    })
    .map(({ bid }, i) => bid * (hands.length - i))
    .reduce((acc, value) => acc + value, 0);
}

function part2(input: ParsedInput) {
  cardRanksMap.set("J", Infinity);

  const hands: Array<{
    cards: Card[];
    hand: Hand;
    bid: number;
  }> = input.map(({ cards, bid }) => {
    const occurences = cards.reduce<Record<Card, number>>((acc, card) => {
      acc[card] = (acc[card] || 0) + 1;

      return acc;
    }, {} as Record<Card, number>);

    const amountOfJokers = occurences["J"] ?? 0;

    const entries = Object.entries(occurences);

    if (
      amountOfJokers === 5 ||
      entries.some(([, count]) => count === 5 - amountOfJokers)
    ) {
      return {
        cards,
        hand: "five-of-a-kind",
        bid,
      };
    }

    if (
      entries.some(
        ([card, count]) => card !== "J" && count === 4 - amountOfJokers
      )
    ) {
      return {
        cards,
        hand: "four-of-a-kind",
        bid,
      };
    }

    // Player can have maximum 1 jokers at this point. With 3 different remaining cards, players can never have full-house.
    // With any card twice, player already has four-of-a-kind.
    if (
      (amountOfJokers === 1 &&
        entries.filter(([, count]) => count === 2).length === 2) ||
      (amountOfJokers === 0 &&
        entries.some(([, count]) => count === 2) &&
        entries.some(([, count]) => count === 3))
    ) {
      return {
        cards,
        hand: "full-house",
        bid,
      };
    }

    if (entries.some(([, count]) => count === 3 - amountOfJokers)) {
      return {
        cards,
        hand: "three-of-a-kind",
        bid,
      };
    }

    // With any joker, a player can always have something better than two-pair,
    // so we can safely ignore the case
    if (entries.filter(([, count]) => count === 2).length === 2) {
      return {
        cards,
        hand: "two-pair",
        bid,
      };
    }

    // If the player has a Joker, they can have a pair with any card. If not,
    // we must check if they have a pair with the remaining cards.
    if (amountOfJokers > 0 || entries.some(([, count]) => count === 2)) {
      return {
        cards,
        hand: "one-pair",
        bid,
      };
    }

    return {
      cards,
      hand: "highest-card",
      bid,
    };
  });

  return hands
    .sort(({ hand: hand1, cards: cards1 }, { hand: hand2, cards: cards2 }) => {
      if (hand1 !== hand2) {
        return handRanksMap.get(hand1)! - handRanksMap.get(hand2)!;
      }

      return compareCards(cards1, cards2);
    })
    .map(({ bid }, i) => bid * (hands.length - i))
    .reduce((acc, value) => acc + value, 0);
}

presentDayResults(DAY, getInput, part1, part2);
