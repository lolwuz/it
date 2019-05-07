import { BoggleService } from './../boggle.service';
import { Component, OnInit, Input } from '@angular/core';
import { Board, Gues } from '../board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent {
  _gameCode: string;
  _letters: string[] = [];
  _selected: number[] = [];
  _boardArray: any[] = [];

  _isMouseDown: boolean = false;
  _lastMouseEnter: number;

  constructor(private boggleService: BoggleService) { }

  @Input()
  /** Set board passed down from begin.component */
  set board(board: Board) {
    const boardString = board.board;
    this._letters = [];

    // Fill letters array.
    for (let i = 2; i < boardString.length; i = i + 5) {
      this._letters.push(board.board[i])
    }

    // Letters in 2D array for rendering
    let cells = [];
    for (var i = 1; i <= this._letters.length; i++) {
      cells.push(this._letters[i - 1]);
      if ((i % 4) == 0) {
        this._boardArray.push(cells);
        cells = [];
      }
    }

    this._gameCode = board.game_code;
  }

  /**
   * Register the row, col the mouse is hovered and saves the index of the letter
   * @param x : row
   * @param y : col
   */
  mouseEnter(event: any, x: number, y: number) {
    const index = (x * 4) + y;

    this._lastMouseEnter = index; // Last mouse enter for 'hover' class

    // Add selected to selected list if mouse is down.
    if (!this._selected.includes(index) && event.buttons === 1 && this.isInbound(index))
      this._selected.push(index);
  }

  /**
   * Returns the correct class if selected/hovering 
   * @param x : row
   * @param y : col
   */
  getHoverClass(x: number, y: number) {
    const index = (x * 4) + y;

    if (this._selected.includes(index))
      return 'selected'
    else if (this._lastMouseEnter === index)
      return 'hover'
    else
      return 'none'
  }

  /**
   * checks if last board position can be reached.
   * @param boardPosition index of last board position
   */
  isInbound(boardPosition) {
    if (this._selected.length < 1) { return true }

    let last_position = this._selected[this._selected.length - 1]

    if (Math.abs(boardPosition - last_position) < 6) { return true } else { return false }
  }

  /**
   * Checks if word is correct after 
   */
  mouseUp() {
    let word: string = ''

    for (let i: number = 0; i < this._selected.length; i++) {
      let index = this._selected[i]
      word += this._letters[index] // Append letter to string
    }

    if (word.length > 2) {
      this.boggleService.getBoadCheck(this._gameCode, word)
        .subscribe((gues) => {
          let new_gues: Gues = new Gues()
          new_gues.word = word;
          new_gues.points = gues.points;

          // Check if valid gues. 2 == already guesed.
          new_gues.is_valid = gues.is_valid ? 1 : 0
          for (let i = 0; i < this.boggleService.guessed.length; i++) {
            if (this.boggleService.guessed[i].word === word)
              new_gues.is_valid = 2;
          }

          // Ad gues to boggleService
          this.boggleService.guessed.unshift(new_gues);
          this.boggleService.totalPoints += gues.points; 
        });
    }

    this._selected = [];
  }
}
