import { BeginComponent } from './begin/begin.component';
import { BoardComponent } from './board/board.component';
import { StartComponent } from './start/start.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'begin/:game_code', component: BeginComponent},
  { path: 'board/:game_code', component: BoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
