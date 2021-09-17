import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note';
import { ToastrService } from 'ngx-toastr';
import { NotesService } from 'src/app/services/notes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  isLoading: boolean = false;
  isAuth: boolean = false;
  notes: Note[] = [];
  userId: string;
   
  constructor(
    private toastr: ToastrService,
    private noteService: NotesService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.isLoading =true
    this.isAuth = this.auth.getIsAuth();
    if(this.isAuth){
      this.userId = this.auth.getUserId();
      this.noteService.getNotes();
      this.noteService.getUpdateListener()
      .subscribe((notes: Note[]) => {
        this.isAuth = this.auth.getIsAuth();
        this.isLoading = false;
        this.notes = notes;
      });
    }else{
      this.router.navigateByUrl('/signin');
    }
  }

  onDelete(id: string){
    try{
      this.noteService.deleteNote(id);
      this.toastr.success("Note Deleted!");
    }catch(err){
      this.toastr.error("Unable to delete!");
    }
  }

}
