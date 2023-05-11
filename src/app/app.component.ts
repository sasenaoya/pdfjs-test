import { Component } from '@angular/core';
import * as pdfjs from 'pdfjs-dist';

/**
 * とりあえずPDFを読み込んでみるサンプル。
 * でも、読み込み時に以下のエラーが発生する。
 * No "GlobalWorkerOptions.workerSrc" specified.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdfjs-test';
  pdf?: pdfjs.PDFDocumentProxy;

  /** PDFファイルが選択された */
  onPdfFileChange(e: Event) {
    const files = (e.target as any).files;
    if (files?.length > 0) {
      this.openPdf(files[0]);
    }
  }

  /** PDFファイルを読み込む */
  private openPdf(file: File) {
    var fileReader = new FileReader();
    fileReader.onload = () => {
      const loadingTask = pdfjs.getDocument(fileReader.result!);
      loadingTask.promise.then(pdf => {
        this.pdf = pdf;
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
}
