import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PollComponent} from './views/poll/poll.component';
import {AdminComponent} from './views/admin/admin.component';


const routes: Routes = [
  { path: '', component: PollComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
