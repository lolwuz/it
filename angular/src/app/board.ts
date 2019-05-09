export class Board {
  game_code: string;
  board: string;
}

export class Gues {
  word: string;
  is_valid: number;
  points: number;
}

export class Solution {
  points: number;
  solved: string[];
}