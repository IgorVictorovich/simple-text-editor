import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Words, WordFindingService } from '../services/word-finding.service';
import { TextFormatService } from '../services/text-format.service';

export enum FormatOption {
  Bold = 'b',
  Italic = 'i',
  Undreline = 'u',
  ClearAll = 'clear_all'
}

@Component({
  selector: 'app-text-editor',
  templateUrl: 'text-editor.component.html',
  styleUrls: ['text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {

  words: Words = [];

  @ViewChild('textArea') textArea: ElementRef;

  get selectedWord(): string {
    return window.getSelection().toString();
  }

  constructor(private _similarWords: WordFindingService,
    private _textFormat: TextFormatService) {
  }

  ngOnInit() {
  }

  onLoadSimilarClick() {
    const selected = window.getSelection().toString();
    if (selected) {
      this.find(selected);
    }
  }

  find(word: string) {
    if (!word) {
      return;
    }
    this._similarWords.similarWords(word)
      .toPromise()
      .then(value => this.words = value);
  }

  change(value: string) {
    this._textFormat.replaceSelectedText(value);
  }

  applyCommand(option: FormatOption) {
    switch (option) {
      case FormatOption.Bold:
      case FormatOption.Italic:
      case FormatOption.Undreline:
        const selecttion = window.getSelection();
        this._textFormat.formatSelectedText(option, this.selectedWord, selecttion);
        break;
      case FormatOption.ClearAll:
        let innerHTML = this.textArea.nativeElement.innerHTML;
        innerHTML = this._textFormat.clearFormat(innerHTML);
        this.textArea.nativeElement.innerHTML = innerHTML;
        break;
    }
  }

}