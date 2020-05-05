import { Component, EventEmitter, Output, OnInit } from '@angular/core';
// componenet needs to be imported to then be used
import { NgForm } from '@angular/forms'
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = "";
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;

  //angular gives you what you want
  //route is an example of injecting something
  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    //parameter in url could change, therefore observable, therefore listen to changes in the route url
     this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.isLoading = true;
            this.postsService.getPost(this.postId).subscribe(postData => {
              this.isLoading = false;
              this.post = { id: postData._id, title: postData.title, content: postData.content }
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
     } );
  }

  onSavePost(form : NgForm) {
    //create list object
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
      form.resetForm();
    }
  }

}
