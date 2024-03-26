import { WatchTitle } from "./watchtitle";

export class UserWatchTitle {
  id:number;
  tmdb_id:number;
  watched:boolean;
  rating:boolean | null;
  review:string;
  watch_title:WatchTitle

  constructor(userWatchTitle:any) {
    this.id = userWatchTitle.id || -1;
    this.tmdb_id = userWatchTitle.tmdb_id || -1;
    this.watched = userWatchTitle.watched || false;
    this.rating = userWatchTitle.rating || null;
    this.review = userWatchTitle.review || '';
    this.watch_title = userWatchTitle.watch_title;
  }
}
