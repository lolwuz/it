import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { StartComponent } from './start/start.component';
import { BeginComponent } from './begin/begin.component';
import { GuessedComponent } from './guessed/guessed.component';
import { SolvedComponent } from './solved/solved.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    StartComponent,
    BeginComponent,
    GuessedComponent,
    SolvedComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
