import { Solution } from './../board';
import { buggleService } from './../buggle.service';
import { Component, OnInit, Input } from '@angular/core';
import { Board, Gues } from '../board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent {
  private letters: string[] = [];
  private selected: number[] = [];
  private lastMouseEnter: number;

  public boardArray: any[] = [];

  constructor(public buggleService: buggleService) { }

  @Input() gameOver: boolean;
  @Input()
  /** Set board passed down from begin.component */
  set board(board: Board) {
    // Empty prev. board
    this.letters = [];
    this.selected = [];
    this.boardArray = []

    const boardString = board.board;

    // Fill letters array.
    for (let i = 2; i < boardString.length; i = i + 5) {
      this.letters.push(board.board[i])
    }

    // Letters in 2D array for rendering
    let cells = [];
    for (var i = 1; i <= this.letters.length; i++) {
      cells.push(this.letters[i - 1]);
      if ((i % 4) == 0) {
        this.boardArray.push(cells);
        cells = [];
      }
    }
  }

  /**
   * Register the row, col the mouse is hovered and saves the index of the letter
   * @param x : row
   * @param y : col
   */
  mouseEnter(event: any, x: number, y: number) {
    const index = (x * 4) + y;

    this.lastMouseEnter = index; // Last mouse enter for 'hover' class

    // Add selected to selected list if mouse is down.
    if (this.isInbound(index) && !this.selected.includes(index) && event.buttons === 1 )
      this.selected.push(index);
  }

  /**
   * Returns the correct class if selected/hovering 
   * @param x : row
   * @param y : col
   */
  getHoverClass(x: number, y: number) {
    const index = (x * 4) + y;

    if (this.selected.includes(index))
      return 'selected'
    else if (this.lastMouseEnter === index)
      return 'hover'
    else
      return 'none'
  }

  /**
   * checks if last board position can be reached.
   * @param boardPosition index of last board position
   */
  isInbound(boardPosition) {
    if (this.selected.length < 1) { return true }

    let lastPosition = this.selected[this.selected.length - 1];
    let index2D = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];

    let adj = [];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (index2D[x][y] === boardPosition) {
          for (let c = -1; c <= 1; c++) {
            for (let j = -1; j <= 1; j++) {
              let xc = x + c
              let yj = y + j
              if (xc >= 0 && xc <= 3 && yj >= 0 && yj <= 3) 
                adj.push(index2D[xc][yj]);
            }
          }
        }
      }
    }
    
    if (adj.includes(lastPosition)){  return true } else { return false }
  }

  /**
   * Checks if word is correct after mouseUp
   */
  mouseUp() {
    if (this.gameOver) {
      this.selected = []
      return // Game ended
    }

    let word: string = ''

    for (let i: number = 0; i < this.selected.length; i++) {
      let index = this.selected[i]
      word += this.letters[index] // Append letter to string
    }

    if (word.length > 2) {
      this.buggleService.getBoadCheck(this.buggleService.game_code, word)
        .subscribe((gues) => {
          let new_gues: Gues = new Gues()
          new_gues.word = word;
          new_gues.points = gues.points;

          // Check if valid gues. 2 == already guesed.
          new_gues.is_valid = gues.is_valid ? 1 : 0
          for (let i = 0; i < this.buggleService.guessed.length; i++) {
            if (this.buggleService.guessed[i].word === word)
              new_gues.is_valid = 2;
          }

          // Ad gues to buggleService
          this.buggleService.guessed.unshift(new_gues);
          this.buggleService.totalPoints += gues.points;
        });
    }

    this.selected = [];
  }
}
