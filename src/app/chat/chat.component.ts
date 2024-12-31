import { Component, Input, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MessagesService } from '../services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessage } from '../../../server/models/IMessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  constructor (private userService:UsersService, private messagesService:MessagesService, private route:ActivatedRoute) { }

  @ViewChild('scrollBox') scrollBox: any

  messages:IMessage[] = []
  content:string
  sentMessage:IMessage
  @Input() senderId:string
  @Input() receiverId: string;
  @Input() receiverName: string

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollBox) {
        const scrollElement = this.scrollBox.nativeElement;
        scrollElement.scrollIntoView({ block: 'end' });
      }
    }, 1);
  }

  ngOnChanges () {
    this.messagesService.getMessages(this.senderId, this.receiverId).subscribe({
      next: (data:IMessage[])=> {
        this.messages = data
        this.scrollToBottom()
      },
      error: (error) => {console.log(error)},
      complete: () => {console.log()}
    });
  }

  ngOnInit() {
    this.messagesService.listenForMessages().subscribe({
      next: (data) => {
        console.log("This is the data " + data)
        this.messages.push(data)
        this.scrollToBottom()
      },
      error: (error) => {console.log(error)},
      complete: () => {console.log("hellobruderson")}
    })

  }

  sendMessage (content) {
    this.sentMessage = {
      sender: this.senderId,
      receiver: this.receiverId,
      date: new Date(),
      content: content,
      read: false
    }
      this.messagesService.sendMessage(this.sentMessage).subscribe({
        next: (data) => {
          this.messages.push(this.sentMessage)
          console.log(data)
          this.content = undefined
        },
        error: (error) => {console.log(error)},
        complete: () => {
          console.log("message sent")
            this.scrollToBottom()
        }
      })
  }

}
