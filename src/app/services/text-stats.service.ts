import { Injectable } from '@angular/core';

export interface TextStats {
  words: number;
  characters: number;
}

@Injectable({
  providedIn: 'root'
})
export class TextStatsService {
  calculateStats(text: string): TextStats {
    const trimmed = text.trim();
    
    if (!trimmed) {
      return { words: 0, characters: 0 };
    }

    const words = trimmed.split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;

    return { words, characters };
  }
}

