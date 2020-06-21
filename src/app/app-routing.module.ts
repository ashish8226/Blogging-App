import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {CreatePostComponent} from './posts/create-post/create-post.component';

const routes:Routes=[
  {path:'',component:PostListComponent},
  {path:'create',component:CreatePostComponent},
  {path:'edit/:id',component:CreatePostComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
