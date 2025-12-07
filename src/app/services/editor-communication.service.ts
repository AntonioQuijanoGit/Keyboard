import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorCommunicationService {
  private insertTextSubject = new Subject<string>();
  insertText$ = this.insertTextSubject.asObservable();

  insertText(text: string): void {
    this.insertTextSubject.next(text);
  }
}

