import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';;
import { Note } from '../models/note';

const BACKEND_URL = `${environment.apiUrl}/notes/`

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = [];
  notesUpdated = new Subject<Note[]>();
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getNotes() {
    this.http.get<{notes: any }>(
      BACKEND_URL)
      .pipe(map((data) => {
        return data.notes.map((note: any) => {
          return {
            title: note.title,
            content: note.content,
            date: note.date,
            id: note._id,
            creator: note.creator
          };
        });
      }))
      .subscribe((notes) => {
        this.notes = notes;
        this.notesUpdated.next([...this.notes]);
      })
  }

  getUpdateListener(){
    return this.notesUpdated.asObservable();
  }

  getNote(id: string) {
    return this.http.get<{
       _id: string, 
       title: string, 
       content: string, 
       date: any,
       creator: string
      }>(BACKEND_URL+id);
  }

  addNote(note: Note) {
    this.http.post<{status: string, noteId: string}>(BACKEND_URL, note)
      .subscribe((data) => {
        const id = data.noteId;
        note.id = id;
        this.notes.push(note);
        this.notesUpdated.next([...this.notes]);
        this.router.navigateByUrl('/');
      });
  }

  updateNote(id: string, title: string, content: string){
    const note: Note = { 
      id: id, 
      title: title, 
      content: content,
      date: new Date(),
      creator: null
    }
    this.http.put<{status: string, note: any}>(BACKEND_URL+id, note)
    .subscribe(() => {
      const findNote = [...this.notes];
      const noteIndex = findNote.findIndex(x => x.id === id);
      findNote[noteIndex] = note;
      this.notes = findNote;
      this.notesUpdated.next([...this.notes]);
      this.router.navigateByUrl('/');
    });
  }

  deleteNote(id: string){
    this.http.delete(BACKEND_URL+id)
    .subscribe(() => {
      const currentNote = this.notes.filter(note => note.id !== id);
      this.notes = currentNote;
      this.notesUpdated.next([...this.notes]);
    });
  }
}
