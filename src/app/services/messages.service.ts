import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client"
import { Observable } from 'rxjs';
import { IMessage } from '../../../server/models/IMessage';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private socket:Socket 

  constructor(private http:HttpClient, private userService:UsersService) {
    this.socket = userService.getSocket()
  }
  
  getMessages (senderId, receiverId) {
    return this.http.get(`http://localhost:3000/messages/get/${senderId}/${receiverId}`); 
  }

  sendMessage (message:IMessage) {
    return this.http.post('http://localhost:3000/messages/post', message)
  }

  getAllMessages () { //Rotta di Orsted
    return this.http.get("http://localhost:3000/allMessages")
  }

  setToRead (senderId, receiverId) {
    return this.http.patch(`http://localhost:3000/messages/patch/${senderId}/${receiverId}`, {})
  }

  listenForMessages(): Observable<any> { //So this basically activates when a message is sent. On the server there is an emitter that actiates on post requests, 
  // it shows the message instantly
    return new Observable(observer => {
      this.socket.on('received_message', message => {
        console.log("emitted message")
        console.log(message)
        observer.next(message);
      });
    })
  }

  listenForUpdateRead() { // So this activates on the user who sent the message, it listens for events emitted in the patch request
    return new Observable(observer => {
      this.socket.on('read_message', () => {
        console.log("listenForUpdateRead activated")
        observer.next("message was read")
      });
    })
  } 


}
