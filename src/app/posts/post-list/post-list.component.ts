import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

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
  isLoading=false;
  private postSubscription: Subscription;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.postService.getPosts();
    this.postSubscription=this.postService.getPostUpdateListener().subscribe((posts)=>{
      this.posts=posts;
      this.isLoading=false;
    })

   // this.postService.getPosts().subscribe((data)=>{
   //   console.log("success",data,typeof data);
   //   this.posts=data.posts;
   // },error => {
   //   console.log('error',error);
   // });
  }


  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

  onUpdate(id: string) {

  }

  onDelete(id: string) {
    console.log(id + " pressed")
    this.postService.deletePost(id);
  }
}
