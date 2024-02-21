export class List {
  id:number;
  private:boolean;
  title:string;

  constructor(list:any) {
    this.id = list.id || 0;
    this.private = list.private || true;
    this.title = list.title || '';
  }
}
