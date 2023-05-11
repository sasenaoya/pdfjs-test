import { Component, ElementRef, ViewChild } from '@angular/core';
import * as pdfjs from 'pdfjs-dist';

/**
 * とりあえずPDFを読み込んでみるサンプル。
 * 読み込んだPDFをCanvasに描画してみる。
 * でもPDFによってはフォントが描画されない。
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('pdfCanvas') pdfCanvas?: ElementRef;
  title = 'pdfjs-test';
  pdf?: pdfjs.PDFDocumentProxy;
  pageNumber?: number;
  canvasWidth: number = 0;
  canvasHeight: number = 0;

  constructor() {
    pdfjs.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
  }

  /** PDFファイルが選択された */
  onPdfFileChange(e: Event) {
    this.pdf = undefined;
    const files = (e.target as any).files;
    if (files?.length > 0) {
      this.openPdf(files[0]);
    }
  }

  /** PDFをCanvasに描画する */
  async renderPage(pageNumber: number) {
    if (this.pdf && this.pdfCanvas) {
      this.pageNumber = pageNumber;

      const page = await this.pdf.getPage(pageNumber);
      const scale = 4.0;
      const viewport = page.getViewport({ scale });

      const canvas = this.pdfCanvas.nativeElement;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      this.canvasWidth = canvas.width / scale;
      this.canvasHeight = canvas.height / scale;

      const context = canvas.getContext("2d");

      const renderContext = {
        canvasContext: context,
        viewport,
      };
      page.render(renderContext);
    }
  }

  /** PDFファイルを読み込む */
  private openPdf(file: File) {
    var fileReader = new FileReader();
    fileReader.onload = () => {
      const loadingTask = pdfjs.getDocument(fileReader.result!);
      loadingTask.promise.then(pdf => {
        this.pdf = pdf;
        setTimeout(() => {
          // pdfが設定されないとcanvasが作成されないので、setTimeoutで待ってから描画する
          this.renderPage(1);
        });
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
}
