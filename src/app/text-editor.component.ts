import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Words, WordFindingService } from './word-finding.service';

export enum FormatOption {
  Bold = 'b',
  Italic = 'i',
  Undreline = 'u',
  ClearAll = 'clear_all'
}

/**
 * @title Basic buttons
 */
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

  constructor(private _similarWords: WordFindingService) {
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
    this.replaceSelectedText(value);
  }

  applyCommand(option: FormatOption) {
    const text = this.textArea.nativeElement;
    switch(option) {
      case FormatOption.Bold:
      case FormatOption.Italic:
      case FormatOption.Undreline:
        this.formatSelectedText(option, this.selectedWord);
        break;     
      case FormatOption.ClearAll:
        this.clearFormat();
        break;           
    }
  }

  private clearFormat() {
    let innerHTML = this.textArea.nativeElement.innerHTML;
    innerHTML = this.removeTags('<b>', innerHTML);
    innerHTML = this.removeTags('</b>', innerHTML);
    innerHTML = this.removeTags('<u>', innerHTML);
    innerHTML = this.removeTags('</u>', innerHTML);
    innerHTML = this.removeTags('<i>', innerHTML);
    innerHTML = this.removeTags('</i>', innerHTML);
    this.textArea.nativeElement.innerHTML = innerHTML;
  }

  private removeTags(tag: string, text: string) {
    while (text.indexOf(tag) > -1) {
      text = text.replace(tag, '');
    }

    return text;
  }

  private formatSelectedText(tag: string, selected: string) {
    let sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            const el = document.createElement(tag);
            el.innerText = selected;
            range.insertNode(el);
        }
    }
  }

  private replaceSelectedText(replacementText: string) {
    let sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
  }

}