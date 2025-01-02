import { Component, Input, ViewChild } from '@angular/core';
import { MessagesService } from '../services/messages.service';
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
  constructor (private messagesService:MessagesService) { }

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
    console.log("ngOnChanges")

    this.messagesService.setToRead(this.senderId, this.receiverId).subscribe({
      next: (data) => {console.log(data)}
    })

    this.messagesService.getMessages(this.senderId, this.receiverId).subscribe({
      next: (data:IMessage[])=> {
        this.messages = data
        this.scrollToBottom()
      },
      error: (error) => {
        if (error.status === 404) {
          console.log("Not found");
          this.messages = []
        } else {
          console.log(error);
        }
      },
      complete: () => {console.log()}
    });
  }

  ngOnInit() {
    this.messagesService.listenForUpdateRead().subscribe({
      next: (data) => {
        console.log(data)
      }
    })

    this.messagesService.listenForMessages().subscribe({
      next: (data:IMessage) => {
        if (data.sender == this.receiverId) {
          this.messages.push(data)
          this.scrollToBottom()
        }
      },
      error: (error) => {console.log(error)},
      complete: () => {console.log()}
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
            this.scrollToBottom()
        }
      })
  }

}
