import { Component, EventEmitter, Output, OnInit } from '@angular/core';
// componenet needs to be imported to then be used
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import {mimeType } from "./mime-type.validator"

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
  form: FormGroup; //groups all the controls of a this.form, can also have sub groups
  imagePreview : string;
  private mode = 'create';
  private postId: string;

  //angular gives you what you want
  //route is an example of injecting something
  constructor(public postsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    this.form = new FormGroup({
      //Validators.required is a method, but just pass the reference
      'title': new FormControl(null, {
        validators: [ Validators.required, Validators.minLength(3)]
    }),
      'content': new FormControl(null, { validators: [Validators.required]}),
      'image' : new FormControl(null, { validators: [Validators.required],
        asyncValidators: [mimeType]})
  });

    //parameter in url could change, therefore observable, therefore listen to changes in the route url
     this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.isLoading = true;
            this.postsService.getPost(this.postId).subscribe(postData => {
              this.isLoading = false;
              this.post = {
                id: postData._id,
                title: postData.title,
                content: postData.content };
                this.form.setValue({
                  'title': this.post.title,
                  'content' : this.post.content
                });
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    //data url
    const reader = new FileReader();
    //the below is asynch
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    //create list object
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
    this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

}
