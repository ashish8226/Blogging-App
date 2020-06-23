import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {CreatePostComponent} from './posts/create-post/create-post.component';

import {AuthGuard} from './auth/auth.guard';
import {AuthRoutingModule} from './auth/auth-routing.module';

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: CreatePostComponent, canActivate: [AuthGuard]},

  {path: 'edit/:id', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'auth', loadChildren:() => import('src/app/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
