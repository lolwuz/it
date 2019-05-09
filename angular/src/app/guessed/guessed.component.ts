import { Component, OnInit } from '@angular/core';
import { buggleService } from '../buggle.service';

@Component({
  selector: 'app-guessed',
  templateUrl: './guessed.component.html',
  styleUrls: ['./guessed.component.css']
})
export class GuessedComponent {

  constructor(private buggleService: buggleService) {}

  getValidClass(validity : number) {
    switch(validity){
      case 0:
        return "alert-danger"
      case 1:
        return "alert-success"
      case 2:
        return "alert-info"
      default: 
        return ""
    }
  }
}
