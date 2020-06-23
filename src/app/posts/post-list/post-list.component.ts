import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', description: 'Description of first post'},
  //   {title: 'Second Post', description: 'Description of second post'},
  //   {title: 'Third Post', description: 'Description of third post'}
  //   ];
  posts: Post[] = [];
  isLoading = false;
  private postSubscription: Subscription;
  private authSubs: Subscription;
  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 3;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId:string;
  constructor(private postService: PostService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId=this.authService.getUserId();
    // console.log(this.posts);
    this.postSubscription = this.postService.getPostUpdateListener().subscribe((postData: { posts: Post[], postCount: number }) => {
      // console.log(postData);
      this.posts = postData.posts;
      // console.log(postData);
      // console.log(this.posts);
      this.totalPosts = postData.postCount;
      this.isLoading = false;
    });
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authSubs = this.authService.getAuthListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId=this.authService.getUserId();
    });

    // this.postService.getPosts().subscribe((data)=>{
    //   console.log("success",data,typeof data);
    //   this.posts=data.posts;
    // },error => {
    //   console.log('error',error);
    // });
  }


  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authSubs.unsubscribe();
  }


  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    },()=>{
      this.isLoading=false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

  }
}
