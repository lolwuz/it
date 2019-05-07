import { Board } from './../board';
import { BoggleService } from './../boggle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-begin',
  templateUrl: './begin.component.html',
  styleUrls: ['./begin.component.css']
})

export class BeginComponent implements OnInit {
  board: Board;
  timeLeft: number = 60;
  interval;

  route: ActivatedRoute;
  boggleService: BoggleService;
  private router: Router

  ngOnInit(): void {
    // this.getBoard();
  }

  getBoard(): void {
    const game_code = this.route.snapshot.params.game_code;

    this.boggleService.getBoard(game_code)
      .subscribe((board) => {
        this.board = board
        this.startTimer();
      });
  }

  onClickStart() {
    this.getBoard();
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
    this.board = null; // Clear board
  }

  goBack(): void {
    this.router.navigateByUrl(`/`)
  }
}
