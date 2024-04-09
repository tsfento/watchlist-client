import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TmdbService } from '../../core/services/tmdb.service';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TitleService } from '../../core/services/title.service';
import { UserWatchTitle } from '../../shared/models/user-watch-title';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user';
import { DailyQuote } from '../../shared/models/daily-quote';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: []
})
export class HomeComponent implements OnInit, OnDestroy {
  med_poster_url:string = 'https://image.tmdb.org/t/p/w300';
  small_poster_url:string = 'https://image.tmdb.org/t/p/w154'

  currentUser:User | null = null;
  currentUserSub = new Subscription;

  ratedPositive:UserWatchTitle[] = [];
  recommendations:{[key: string]: TmdbMovie[]}[] = [];
  checkRecommendations:{[key: string]: TmdbMovie[]}[] = [];
  gotRecommendationsSub = new Subscription;
  gotRecsIndexSub = new Subscription;
  recsIndex:number = 0;
  isLoading:boolean = false;

  dailyQuote:DailyQuote | null = null;
  dailyQuoteSub = new Subscription;
  quoteClicked:boolean = false;

  nowPlayingMovies:TmdbMovie[] = [];
  nowPlayingMovieIndex:number = 0;
  gotNowPlayingMoviesSub = new Subscription;

  popularMovies:TmdbMovie[] = [];
  popularMovieIndex:number = 0;
  gotPopularMoviesSub = new Subscription;

  trendingTV:TmdbMovie[] = [];
  trendingTVIndex:number = 0;
  gotTrendingTVSub = new Subscription;

  thisWeekTV:TmdbMovie[] = [];
  thisWeekTVIndex:number = 0;
  gotThisWeekTVSub = new Subscription;

  constructor(private tmdbService:TmdbService, public titleService:TitleService, private userService:UserService) {}

  @HostListener('window:scroll',['$event'])
  onWindowScroll(){
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
      this.loadNextPageRecs();
    }
  }

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
        this.ratedPositive = this.currentUser.user_watch_titles.filter(u => u.rating === true);
        this.ratedPositive = this.shuffle(this.ratedPositive);

        if (this.recommendations.length === 0) {
          this.getInitialRecommendations();
        }
      }
    });

    this.dailyQuoteSub = this.titleService.dailyQuoteSubject.subscribe((quote) => {
      if (quote !== null) {
        this.dailyQuote = quote;
      } else {
        this.titleService.getQuote();
      }
    });

    this.gotNowPlayingMoviesSub = this.tmdbService.gotNowPlayingMovies.subscribe((gotTitles) => {
      if (gotTitles.length !== 0) {
        this.nowPlayingMovies = gotTitles;
      } else {
        this.tmdbService.getNowPlayingMovies();
      }
    });

    this.gotPopularMoviesSub = this.tmdbService.gotPopularMovies.subscribe((gotTitles) => {
      if (gotTitles.length !== 0) {
        this.popularMovies = gotTitles;
      } else {
        this.tmdbService.getPopularMovies();
      }
    });

    this.gotTrendingTVSub = this.tmdbService.gotTrendingTV.subscribe((gotTitles) => {
      if (gotTitles.length !== 0) {
        this.trendingTV = gotTitles;
      } else {
        this.tmdbService.getTrendingTV();
      }
    });

    this.gotThisWeekTVSub = this.tmdbService.gotThisWeekTV.subscribe((gotTitles) => {
      if (gotTitles.length !== 0) {
        this.thisWeekTV = gotTitles;
      } else {
        this.tmdbService.getThisWeekTV();
      }
    });

    this.gotRecommendationsSub = this.tmdbService.gotRecommendations.subscribe((recs) => {
      if (recs?.length !== 0) {
        this.recommendations = recs;
      } else {
        this.getInitialRecommendations();
      }
    });

    this.gotRecsIndexSub = this.tmdbService.gotRecsIndex.subscribe((index) => {
      this.recsIndex = index;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.gotNowPlayingMoviesSub.unsubscribe();
    this.gotPopularMoviesSub.unsubscribe();
    this.gotTrendingTVSub.unsubscribe();
    this.gotThisWeekTVSub.unsubscribe();
    this.gotRecommendationsSub.unsubscribe();
    this.gotRecsIndexSub.unsubscribe();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // return true;
    // return false;
  }

  shuffle(array:UserWatchTitle[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  clickQuote() {
    this.quoteClicked = !this.quoteClicked;
  }

  changeIndex(type:string, index:number) {
    switch(type) {
      case 'nPMovie':
        this.nowPlayingMovieIndex = index;
        break;
      case 'popMovie':
        this.popularMovieIndex = index;
        break;
      case 'trendingTV':
        this.trendingTVIndex = index;
        break;
      case 'thisWeekTV':
        this.thisWeekTVIndex = index;
        break;
    }
  }

  setActive(drawer:string, index:number, event?:any) {
    // TODO fix scrollIntoView for chrome desktop
    const drawerChildren = document.getElementById(drawer)?.children;

    if (drawerChildren) {
      for (let i = 0; i < drawerChildren?.length; i++) {
        drawerChildren[i].children[0].classList.remove('active');
      }
      drawerChildren[index].children[0].classList.add('active');
      drawerChildren[index].children[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    }
  }

  getTmdbIdFromUserWatchTitles(tmdbId:number): UserWatchTitle | undefined {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles?.find(u => u.watch_title.tmdb_id === tmdbId);

      return userWatchTitle;
    } else {
      return;
    }
  }

  setTitleWatched(title:TmdbMovie, contentType:string) {
    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles?.find(u => u.watch_title.tmdb_id === title.id);

      if (userWatchTitle !== undefined) {
        this.titleService.setTitleWatched(this.currentUser!.username, title, contentType);
        userWatchTitle.watched = !userWatchTitle.watched;
      } else {
        this.titleService.setTitleWatched(this.currentUser!.username, title, contentType);
      }
    }
  }

  setRating(rating:boolean, title:TmdbMovie, contentType:string) {
    console.log(title);

    if (this.currentUser !== null && this.currentUser.user_watch_titles.length > 0) {
      const userWatchTitle = this.currentUser.user_watch_titles?.find(u => u.watch_title.tmdb_id === title.id);

      if (userWatchTitle !== undefined) {
        if (userWatchTitle!.rating === rating) {
          this.titleService.setTitleRating(this.currentUser!.username, title, null, contentType);
          userWatchTitle!.rating = null;
        } else {
          this.titleService.setTitleRating(this.currentUser!.username, title, rating, contentType);
          userWatchTitle!.rating = rating;
        }
      } else {
        this.titleService.setTitleRating(this.currentUser!.username, title, rating, contentType);
      }
    }
  }

  onWheel(event:WheelEvent, drawer:HTMLElement) {
    event.preventDefault();
    drawer.scrollLeft += event.deltaY;
  }

  getInitialRecommendations() {
    if (this.ratedPositive.length !== 0) {
      this.isLoading = true;
      for (let i = 0; i < 5; i++) {
        if (i !== this.ratedPositive.length) {
          this.tmdbService.getRecommendations(this.ratedPositive[i].watch_title.content_type, this.ratedPositive[i].watch_title, this.recommendations);
        }
      }
      this.isLoading = false;
    }
  }

  loadNextPageRecs() {
    if (this.ratedPositive.length !== 0) {
      this.isLoading = true;
      for (let i = this.recsIndex; i < this.recsIndex + 5; i++) {
        if (this.recsIndex !== this.ratedPositive.length) {
          this.tmdbService.getRecommendations(this.ratedPositive[i].watch_title.content_type, this.ratedPositive[i].watch_title, this.recommendations);
          this.recsIndex++;
        }
      }
      this.isLoading = false;
    }
  }
}
