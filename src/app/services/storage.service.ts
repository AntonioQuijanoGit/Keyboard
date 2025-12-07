import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'quick-notes-content';

  save(content: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, content);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  load(): string {
    try {
      return localStorage.getItem(this.STORAGE_KEY) || '';
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return '';
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

