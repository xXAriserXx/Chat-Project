import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path: "", pathMatch:"full", redirectTo:"home"},
    {path: "home", component:HomeComponent},
    {path: "register", component:RegisterComponent},
    {path: "login", component:LoginComponent},
    {path: "dashboard/:id", component:DashboardComponent}
];
