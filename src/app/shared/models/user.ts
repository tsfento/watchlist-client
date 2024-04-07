import { UserWatchTitle } from "./user-watch-title";

export class User {
  id:number;
  username:string;
  email:string;
  user_watch_titles:UserWatchTitle[];

  constructor(user:any) {
    this.id = user.id || 0;
    this.username = user.username || '';
    this.email = user.email || '';
    this.user_watch_titles = user.user_watch_titles || [];
  }
}
