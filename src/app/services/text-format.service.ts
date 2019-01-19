import { Injectable } from '@angular/core';

@Injectable()
export class TextFormatService {

    clearFormat(innerHTML: string): string {
        innerHTML = this.removeTags('<b>', innerHTML);
        innerHTML = this.removeTags('</b>', innerHTML);
        innerHTML = this.removeTags('<u>', innerHTML);
        innerHTML = this.removeTags('</u>', innerHTML);
        innerHTML = this.removeTags('<i>', innerHTML);
        innerHTML = this.removeTags('</i>', innerHTML);
        return innerHTML;
    }

    formatSelectedText(tag: string, selected: string, selection: Selection) {
        if (selection && selection.rangeCount) {
            let range = selection.getRangeAt(0);
            range.deleteContents();
            const el = document.createElement(tag);
            el.innerText = selected;
            range.insertNode(el);
        }
    }

    replaceSelectedText(replacementText: string) {
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

    private removeTags(tag: string, text: string) {
        while (text.indexOf(tag) > -1) {
            text = text.replace(tag, '');
        }

        return text;
    }

}