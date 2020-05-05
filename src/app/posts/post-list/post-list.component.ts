import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  //angular gives you what you want
  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts();

    this.postsSub = this.postsService.getPostUpdateListener()
     .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;

     });
      //can add 3 arguments
  }

  ngOnDestroy() {
    //prevents memory leaks
    this.postsSub.unsubscribe();
  }

  onDelete(id: string){
    this.postsService.deletePost(id);
  }
}
