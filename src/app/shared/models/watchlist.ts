import { User } from "./user";

export class WatchList {
  id:number;
  private:boolean;
  title:string;
  user:User;
  user_id:number;
  watch_titles_count:number;
  poster_imgs:string[];

  constructor(watchList:any) {
    this.id = watchList.id || 0;
    this.private = watchList.private || true;
    this.title = watchList.title || '';
    this.user = watchList.user || '';
    this.user_id = watchList.user_id || 0;
    this.watch_titles_count = watchList.watch_titles_count || 0;
    this.poster_imgs = watchList.poster_imgs || [];
  }
}
