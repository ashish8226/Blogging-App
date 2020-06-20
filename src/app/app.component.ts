import {Component} from '@angular/core';
import {Post} from './models/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'impressions';
  posts: Post[] = [];

  onAddedPost(post) {
    this.posts.push(post);
  }
}
