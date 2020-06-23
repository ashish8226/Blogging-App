import {Injectable} from '@angular/core';
import {Post} from '../models/post';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();
  private blogUrl = environment.apiUrl+'blogs/';

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    // console.log(this.blogUrl+queryParams);
    this.http.get<{ message: string, posts: any, maxPosts: number }>(this.blogUrl + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              description: post.description,
              id: post._id,
              imagePath: post.imagePath,
              creator:post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        console.log(transformedPostData.maxPosts);
        this.postUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, description: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('image', image);
    this.http.post<{ message: string, post: Post }>(this.blogUrl, postData).subscribe((responseData) => {
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, description: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('description', description);
      postData.append('image', image);
    } else {
      postData = {id: id, title: title, description: description, imagePath: image,creator:null};
    }

    this.http.put<{ message: string, post: Post }>(this.blogUrl + id, postData).subscribe(response => {

      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete(this.blogUrl + id);
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, description: string, imagePath: string,creator:string }>(this.blogUrl + id);
  }
}
