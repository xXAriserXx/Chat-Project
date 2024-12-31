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
    return this.http.get(`http://localhost:3000/messages/${senderId}/${receiverId}`); 
  }

  sendMessage (message:IMessage) {
    return this.http.post('http://localhost:3000/messages/post', message)
  }

  getAllMessages () { //Rotta di Orsted
    return this.http.get('http://localhost:3000/allMessages')
  }

listenForMessages(): Observable<any> {
  console.log(this.socket)
  return new Observable(observer => {
      console.log("entrato")
      this.socket.on('received_message', message => {
        console.log(message);
        observer.next(message);
      });
  });
}

}
