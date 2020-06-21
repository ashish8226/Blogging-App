import {Injectable} from '@angular/core';
import {Post} from '../models/post';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  private blogUrl = 'http://localhost:4000/api/blogs/';

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    this.http.get<{ message: string, posts: any }>(this.blogUrl)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            description: post.description,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, description: string,image:File) {
    const postData=new FormData();
    postData.append("title",title);
    postData.append("description",description);
    postData.append("image",image);
    this.http.post<{ message: string, postId: string }>(this.blogUrl, postData).subscribe((responseData) => {
      const post: Post = {title: title, description: description, id: responseData.postId};

      console.log(responseData.message);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, description: string) {
    const post: Post = {id: id, title: title, description: description};
    this.http.put(this.blogUrl + id, post).subscribe(response => {
      console.log(response);
      this.router.navigate(["/"]);
    });
  }

  deletePost(id: string) {
    this.http.delete(this.blogUrl + id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.postUpdated.next([...this.posts]);
    }, (err) => {
      console.log('error', err);
    });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, description: string }>(this.blogUrl + id);
  }
}
