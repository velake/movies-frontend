import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { DomSanitizer } from '@angular/platform-browser';
import Movie from '../movie';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
  export class SearchComponent implements OnInit {

  constructor(private _MovieService: MovieService, private _sanitizer: DomSanitizer) { }
    results: any[] = [];
    oldResults: any[] = [];
    showVideo: boolean = false;
    trailerUrl: string;
    movie: Movie = new Movie();
    trailerIndex: number = 0;
    showMessage: boolean = false;
    queryField: FormControl = new FormControl();

    ngOnInit() {
        this.movie.trailerUrls = [];
        this.queryField.valueChanges
        .debounceTime(200)
        .distinctUntilChanged()
        .switchMap((query) =>  this._MovieService.search(query))
        .subscribe((response) => {
            if (response != null) {
              this.results = response;
            }      
        });
      }

    loadVideo(movie: Movie) {
      this.clearResults();
      this.showMessage = false; // displays msg to the user that no other trailers are available

      this.showVideo = true;
      this._MovieService.getMovieTrailer(movie.imdbId)
        .subscribe((movie: Movie) => {
        	if (!movie) {
        		this.showVideo = false;
        	} else {    		
  	        this.movie = movie;
  	        this.trailerIndex = 0;
  	        if (this.movie.trailerUrls.length > 0) {
              this.movie.trailerUrls = movie.trailerUrls.map(url => this._sanitizer.bypassSecurityTrustResourceUrl(url));
              this.showVideo = true;
  	        } else {
  	          this.showMessage = true;
  	        }
        	}
        });
    }

    showNextTrailer(): void {
      if (this.trailerIndex === this.movie.trailerUrls.length - 1) {
        this.showMessage = true;
      } else {
        this.trailerIndex++;
      }
    }

    clearResults(): void {
      this.results = [];
    }     
}