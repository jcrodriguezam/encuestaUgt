import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PollComponent} from './views/poll/poll.component';
import {AlternateComponent} from './views/alternate/alternate.component';
import {AdminComponent} from './views/admin/admin.component';


const routes: Routes = [
  { path: '', component: PollComponent },
  { path: 'alt', component: AlternateComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
