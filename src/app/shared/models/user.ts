export class User {
  username:string;
  email:string;

  constructor(user:any) {
    this.username = user.username || '';
    this.email = user.email || '';
  }
}
