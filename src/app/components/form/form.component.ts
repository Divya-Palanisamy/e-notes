import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Note } from 'src/app/models/note';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  isLoading: boolean = false;
  buttonName = 'ADD';
  private mode='';
  private noteId = '';
  note: Note;

  constructor(
    private service: NotesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('noteId')){
        this.mode = 'edit';
        this.buttonName = 'Save';
        this.noteId = paramMap.get('noteId');
        this.isLoading = true;
        this.service.getNote(this.noteId).subscribe((data) => {
          this.isLoading = false;
           this.note = {
            title: data.title,
            content: data.content,
            id: data._id,
            date: data.date,
            creator: data.creator
           }
        });
      }else{
        this.mode = 'create';
        this.noteId = null;
      }
    });
  }

  onSubmit(f: NgForm){
    if(f.valid){
      try{
        if(this.mode === 'edit'){
          this.buttonName = 'EDIT';
          this.service.updateNote(this.noteId, f.value.title, f.value.content);
          this.toastr.info("Note Modified!");
          this.isLoading = false;
        }else{
          const note: Note = {
            title: f.value.title,
            content: f.value.content,
            date: new Date,
            id: null,
            creator: null
          }
          this.service.addNote(note);
          this.toastr.success("Note Added!");
        }
      }catch(err){
        this.toastr.error("Unable to Add!");
      }
    }else{
      this.toastr.info("Fill the fields");
    }
  }


}
