import { WatchTitle } from "./watchtitle";

export class DailyQuote {
  id:number;
  date:string;
  quote:string;
  watch_title:WatchTitle;

  constructor(dailyQuote:any) {
    this.id = dailyQuote.id;
    this.date = dailyQuote.date;
    this.quote = dailyQuote.quote;
    this.watch_title = dailyQuote.watch_title;
  }
}
