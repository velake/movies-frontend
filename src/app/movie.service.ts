import { Injectable } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import Movie from './movie';
import { environment } from '../environments/environment';

@Injectable()
export class MovieService {
    clientID: string = 'PAST YOUR CLIENT ID';
    baseUrl: string = environment.baseUrl;

    constructor(private _http: HttpClient) { }
    	search(queryString: string) {
        if (queryString != "") {
                let _URL = this.baseUrl + '/movies/search?title=' + queryString + '*';
          return this._http.get(_URL)
          .pipe(
              catchError(this.handleError)
            );  
        } return [];
    }

	    getMovieTrailer(imdbId: string) {
	        let _URL = this.baseUrl + '/movies/?imdbId=' + imdbId;
	          return this._http.get(_URL)
	          .pipe(
	            catchError(this.handleError)
	          );    
	    }

    private handleError(error: HttpErrorResponse) {
	    if (error.error instanceof ErrorEvent) {
	      // A client-side or network error occurred. Handle it accordingly.
	      console.error('An error occurred:', error.error.message);
	    } else {
	      // The backend returned an unsuccessful response code.
	      // The response body may contain clues as to what went wrong,
	      console.error(
	        `Backend returned code ${error.status}, ` +
	        `body was: ${error.error}`);
	    }
	    // return an observable with a user-facing error message
	    return throwError(
	      'Something bad happened; please try again later.');
  };
}