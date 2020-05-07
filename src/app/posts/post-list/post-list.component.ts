import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  isLoading = false;
  postsLimit= 2;
  totalPosts = 0;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private postsSub: Subscription;
  //angular gives you what you want
  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsLimit, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
     .subscribe(( postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
     });

      //can add 3 arguments
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsLimit = pageData.pageSize;
    this.postsService.getPosts(this.postsLimit, this.currentPage);
  }

  ngOnDestroy() {
    //prevents memory leaks
    this.postsSub.unsubscribe();
  }

  onDelete(id: string){
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsLimit, this.currentPage)
    });
  }
}
