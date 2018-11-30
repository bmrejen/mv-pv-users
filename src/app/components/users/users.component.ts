import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

@Component({
 selector: "mv-app-users",
 templateUrl: "./users.component.html",
})

export class UsersComponent implements OnInit {
 public fakeUsers: User;
 public realUsers: User;

 @ViewChild("disableForm") public form: any;
 constructor(private userService: UserService) {
  // constructor
 }

 public ngOnInit(): void {
  console.log("Users component launched");

  this.userService.getFakeUsers()
  .subscribe((users) => {
   console.log(users);
   console.log(this.fakeUsers);
   // this.fakeUsers = users;
  });

  this.userService.getUser()
  .subscribe((realUsers) => {
   this.realUsers = realUsers.data;
   // OU BIEn
   // this.realUsers.push(realUsers.data)
  });
 }

 public trackByFn(index, item) {
  const self = this;

  return index; // or item.id
 }
}
