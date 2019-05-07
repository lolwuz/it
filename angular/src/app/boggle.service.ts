import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, subscribeOn } from 'rxjs/operators';

import { Board, Gues } from './board'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class BoggleService{

  guessed: Gues[] = []; // Store for guessed words
  solved: String[] = []; // Solved words by API
  totalPoints: number = 0;

  private boardUrl = 'http://localhost:5000/board';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET board by game_code */
  getBoard(game_code: String): Observable<Board> {
    const url = `${this.boardUrl}/${game_code}`;

    return this.http.get<Board>(url).pipe(
      tap(_ => this.log(`fetched board game_code=${game_code}`)),
      catchError(this.handleError<Board>(`getBoard game_code=${game_code}`))
    );
  }

  /** GET: check a word */
  getBoadCheck (game_code: string, word: string): Observable<Gues>{
    const url = this.boardUrl + `/${game_code}/check/${word}`

    return this.http.get<Gues>(url).pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError<Gues>(`getBoard game_code=${game_code}`))
    );
  }

  /** POST: create a new board */
  postBoard (): Observable<Board> {
    return this.http.post(this.boardUrl, httpOptions).pipe(
      tap((new_board: Board) => this.log(`added board w/ board=${new_board.board}`)),
      catchError(this.handleError<Board>('addBoard'))
    );
  }
 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // Console log error
  }
}
