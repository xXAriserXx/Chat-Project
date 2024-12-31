import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ChatComponent } from "../chat/chat.component";
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../services/messages.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor (private usersService:UsersService, private route:ActivatedRoute) {}

  users:string[]
  chatOpen:boolean = false
  receiverId:string
  senderId:string
  receiverName:string

  ngOnInit () {
    this.route.params.subscribe(params => {
      this.senderId = params["id"]
      this.usersService.getAllUsers(this.senderId).subscribe({
        next: (data) => {
          this.users = data.usersIds
        },
        error: (error) => {console.log(error)},
        complete: () => {console.log()}
      })
    })
  }

  openChat(receiverId, receiverName) {
    this.receiverId = receiverId 
    this.receiverName =  receiverName
    console.log(receiverId)
    this.chatOpen = true
  }

  /*
  ngOnDestroy () {
    this.usersService.disconnect()
  }
  */
}
