import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'}) //alternative to adding it to providers array
export class PostsService {
  private posts: Post[] = [];
  //array is reference type
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    // backticks allow to dynamically add values into a string
    this.http
    .get<{message: string, posts: any, maxPosts: number }>(
      'http://localhost:3000/api/posts' + queryParams)
    .pipe(
      map(postData => {
      return {
          posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
        }),
        maxPosts: postData.maxPosts
      };
    })
    )
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts });
    });
    //creates a true copy, try to be immutable;
  }

  updatePost(id: string, title: string, content:string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
       postData = this.makeFormData(title, content, image);
        postData.append("id", id);
      } else {
       postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }


    this.http
    .put("http://localhost:3000/api/posts/" + id, postData)
    .subscribe( response => {
      this.finalisePost();
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string }>(
      "http://localhost:3000/api/posts/" + id);
  }

  makeFormData(title: string, content: string, image: File) :FormData {
    const postData = new FormData();
    //data format to combine text values and file (blob)
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    return postData;

  }

  addPost(title: string, content: string, image: File){
    const postData = this.makeFormData(title, content, image)

   this.http
    .post<{ message: string, post: Post }>(
      "http://localhost:3000/api/posts",
      postData
      )
    //could call get post to get id, but this is not efficient
    .subscribe(responseData => {
      this.finalisePost();
    });
  }

  finalisePost(){
    //emits the data
      this.router.navigate(["/"])
  }

  deletePost(postId: string){
    return this.http.delete("http://localhost:3000/api/posts/" + postId);

  }

}
