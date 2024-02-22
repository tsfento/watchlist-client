import { User } from "./user";

export class List {
  id:number;
  private:boolean;
  title:string;
  user:User;
  watch_titles_count:number;

  constructor(list:any) {
    this.id = list.id || 0;
    this.private = list.private || true;
    this.title = list.title || '';
    this.user = list.user || '';
    this.watch_titles_count = list.watch_titles_count || 0;
  }
}
