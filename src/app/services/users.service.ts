import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private socket:Socket 

  constructor(private http:HttpClient, private route:ActivatedRoute) {
  }

  register(user): Observable<any> {
    return this.http.post(`${environment.api}/users/register`, user);
  }

  login(credentials): Observable<any> {
    return this.http.post(`${environment.api}/users/login`, credentials);
  }

  connect (userId) {
    this.socket = io(`${environment.api}`, {
      query: {userId}
    }) 
  }

  getSocket (): Socket{
    if (this.socket == undefined) {
      const userId = window.location.href.split("/").pop()
      this.socket = io(`${environment.api}`, {
        query: {userId}
      }) 
    }
    return this.socket

  }

  disconnect () {
    this.socket.disconnect()
  }

  getAllUsers(sender: any): Observable<any> {
    return this.http.get<any[]>(`${environment.api}/users?excludeId=${sender}`)
  }
}