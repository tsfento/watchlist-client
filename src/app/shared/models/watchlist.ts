import { User } from "./user";

export class WatchList {
  id:number;
  private:boolean;
  title:string;
  user:User;
  watch_titles_count:number;
  poster_img:string;

  constructor(watchList:any) {
    this.id = watchList.id || 0;
    this.private = watchList.private || true;
    this.title = watchList.title || '';
    this.user = watchList.user || '';
    this.watch_titles_count = watchList.watch_titles_count || 0;
    this.poster_img = watchList.poster_img || '';
  }
}
