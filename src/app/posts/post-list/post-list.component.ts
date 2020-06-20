import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';

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
  private postSubscription: Subscription;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.postService.getPosts();
    this.postService.getPostUpdateListener().subscribe((data) => {
      this.posts = data;
      console.log(this.posts,'in post list');
    });
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

}
