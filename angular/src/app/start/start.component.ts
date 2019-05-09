import { Board } from './../board';
import { buggleService } from './../buggle.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  @Input() game_code: string;

  constructor(public buggleService: buggleService, private router: Router) { }

  ngOnInit(): void {
    this.game_code = this.buggleService.game_code;
  }

  onKey(event: any) { // without type info
    this.buggleService.game_code = event.target.value
    this.game_code = this.buggleService.game_code;
  }

  /** Start a game with an existing game code */
  startCode() {
    this.resetOldGame();
    this.router.navigateByUrl(`/begin/${this.buggleService.game_code}`)
  }

  /** POST a new game to the API */
  startRandom() {
    this.resetOldGame();
    
    this.buggleService.postBoard()
      .subscribe(board => {
        this.buggleService.game_code = board.game_code;
        this.router.navigateByUrl(`/begin/${board.game_code}`);
      });
  }

  /** Reset of prev. guessed and solved words */
  resetOldGame() {
    this.buggleService.solved = [];
    this.buggleService.guessed = [];
  }
}
