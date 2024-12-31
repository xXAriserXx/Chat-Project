import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IUser } from '../../../server/models/IUser';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private socket:Socket 

  constructor(private http:HttpClient, private route:ActivatedRoute) {
  }

  register(user): Observable<any> {
    return this.http.post('http://localhost:3000/users/register', user);
  }

  login(credentials): Observable<any> {
    return this.http.post('http://localhost:3000/users/login', credentials);
  }

  connect (userId) {
    console.log(userId)
    this.socket = io("http://localhost:3000", {
      query: {userId}
    }) 
  }

  getSocket (): Socket{
    if (this.socket == undefined) {
      console.log("The socket is being initialized in another way")
      const userId = window.location.href.split("/").pop()
      console.log("This is the id")
      console.log(userId)
      this.socket = io("http://localhost:3000", {
        query: {userId}
      }) 
      console.log(this.socket)
    }
    return this.socket

  }

  disconnect () {
    this.socket.disconnect()
  }

  getAllUsers(sender: any): Observable<any> {
    return this.http.get<any[]>(`http://localhost:3000/users?excludeId=${sender}`)
  }
}