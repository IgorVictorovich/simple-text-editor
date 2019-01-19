import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Words, WordFindingService } from '../services/word-finding.service';
import { TextFormatService } from '../services/text-format.service';

export enum FormatOption {
  Bold = 'b',
  Italic = 'i',
  Undreline = 'u',
  ClearAll = 'clear_all'
}

const SAMPLE = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur,
mollitia labore? Alias vero nulla placeat aut eum enim numquam odit commodi.
Excepturi quibusdam quod mollitia veniam deserunt, culpa nam sint!
`;

@Component({
  selector: 'app-text-editor',
  templateUrl: 'text-editor.component.html',
  styleUrls: ['text-editor.component.scss'],
})
export class TextEditorComponent implements AfterViewInit {

  words: Words = [];

  @ViewChild('textArea') textArea: ElementRef;

  get selectedWord(): string {
    return window.getSelection().toString();
  }

  constructor(private _similarWords: WordFindingService,
    private _textFormat: TextFormatService) {
  }

  ngAfterViewInit() {
    const savedText = this._textFormat.loadText();
    this.textArea.nativeElement.innerHTML = savedText || SAMPLE;
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
    this._textFormat.saveText(this.textArea.nativeElement.innerHTML);
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
    this._textFormat.saveText(this.textArea.nativeElement.innerHTML);
  }

}