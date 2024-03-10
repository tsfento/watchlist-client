export class UserWatchTitle {
  id:number;
  tmdb_id:number;
  watched:boolean;
  review:string;

  constructor(userWatchTitle:any) {
    this.id = userWatchTitle.id || -1;
    this.tmdb_id = userWatchTitle.tmdb_id || -1;
    this.watched = userWatchTitle.watched || false;
    this.review = userWatchTitle.review || '';
  }
}
