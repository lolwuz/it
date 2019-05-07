import { Board } from './../board';
import { BoggleService } from './../boggle.service';
import { Component,  Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

  @Input() game_code: string;

  constructor(private BoggleService: BoggleService, private router: Router) { }

  onKey(event: any) { // without type info
    this.game_code = event.target.value
  }

  startCode () {
    this.router.navigateByUrl(`/begin/${this.game_code}`)
  }

  startRandom () {
    this.BoggleService.postBoard()
      .subscribe(board => {
        this.router.navigateByUrl(`/begin/${board.game_code}`);
      });
  }
}
