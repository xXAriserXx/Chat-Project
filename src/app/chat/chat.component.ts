import { Component, Input, ViewChild } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { IMessage } from '../../../server/models/IMessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap, switchMap, filter, catchError, of, EMPTY, delay, Subject, mergeMap, concatMap, Observer, first } from 'rxjs';

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

    this.messagesService.setToRead(this.senderId, this.receiverId).subscribe({}) 

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
    // console.log("ngOnInit triggered")
    console.log(this.messages.length)

    this.messagesService.listenForUpdateRead().pipe( //serve a caricare i messaggi aggiornati
      switchMap(() => this.messagesService.getMessages(this.senderId, this.receiverId)),
    ).subscribe({
      next: (updatedMessages: IMessage[]) => {
        // console.log("messages when i get them")
        console.log(updatedMessages)
        const lastMessage = { ...this.messages.pop() };
        // console.log('Last message content:', lastMessage?.content);
        if(lastMessage) {
          lastMessage.read = true;
          this.messages = updatedMessages.slice(0, -1); 
          // console.log("updated messages after slice")
          console.log(this.messages)
          console.log(updatedMessages.slice(0, -1))
          this.messages.push(lastMessage); //
          // console.log("this.messages after push")
          // console.log(this.messages);
        }      
      },
      error: (error) => {
        console.error('Error in listenForUpdateRead:', error);
      }
    });

    this.messagesService.listenForMessages().pipe(
      filter((data: IMessage) => data.sender === this.receiverId),
      tap((data: IMessage) => {
        this.messages.push(data); //THere is push here
        this.scrollToBottom();
      }),
      switchMap(() => this.messagesService.setToRead(this.senderId, this.receiverId))
    ).subscribe({
      error: (error) => console.error(error)
    });
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
          this.messages.push(this.sentMessage) //there is another push here
          console.log(data)
          this.content = undefined
          if (this.messages.length === 1) {
            this.ngOnInit()
          }
        },
        error: (error) => {console.log(error)},
        complete: () => {
            this.scrollToBottom()
        }
      })
  }

}
