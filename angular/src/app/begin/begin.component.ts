import { Board, Solution } from './../board';
import { buggleService } from './../buggle.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-begin',
  templateUrl: './begin.component.html',
  styleUrls: ['./begin.component.css']
})

export class BeginComponent implements OnInit {
  board: Board;
  timeLeft: number = 60;
  gameOver: boolean = true;
  interval;
  
  constructor(private route: ActivatedRoute,
    public buggleService: buggleService,
    private router: Router){}
  
  ngOnInit(): void {
    if (!this.buggleService.game_code)
      this.goBack();
    else {
      this.getBoard();
    }
   }

  getBoard(): void {
    this.buggleService.getBoard(this.buggleService.game_code)
      .subscribe((board) => {
        this.buggleService.board = board
      });
  }

  onClickStart() {
    this.gameOver = false;
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } 
      else {
        this.endGame();
      }
    }, 1000)
  }

  endGame() {
    clearInterval(this.interval); // Clears the timer interval
    this.gameOver = true;
    this.solveBoard();
  }

  solveBoard() {
    this.buggleService.getBoadSolved(this.buggleService.game_code)
      .subscribe((solution: Solution) => {
        this.buggleService.solved = solution.solved;
      })
  }

  goBack(): void {
    this.router.navigateByUrl(`/`)
  }
}
