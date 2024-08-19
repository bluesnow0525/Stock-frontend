import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Viewer,
  Worker,
  SpecialZoomLevel,
  DocumentLoadEvent,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Button } from "react-bootstrap";
import Header from "../components/Header";

let workerSrc: string;

async function setWorkerSrc() {
  const pdfjsLib = await import("pdfjs-dist");
  workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
}

setWorkerSrc(); // 组件挂载前调用

const PdfViewer = () => {
  const location = useLocation();
  const [username, setusername] = useState(
    location.state
      ? (location.state as { username: string }).username
      : undefined
  );
  const [isvip, setisvip] = useState(
    location.state ? (location.state as { isvip: Boolean }).isvip : undefined
  );

  const updateUserInfo = (newUsername: string, newIsVip: boolean) => {
    setusername(newUsername);
    setisvip(newIsVip);
  };

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = (e: DocumentLoadEvent) => {
    setNumPages(e.doc.numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + 1, numPages ?? 1));
  };

  return (
    <div className="bg-container">
      <div className="w-full h-[9%] bg-color-1 text-white">
        <Header
          username={username}
          isvip={isvip}
          onUpdateUserInfo={updateUserInfo}
        ></Header>
        <div className="breathing-divider"></div>
        <div className="pdf-controls">
          <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
            上一頁
          </Button>
          <Button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages ?? 1)}
          >
            下一頁
          </Button>
        </div>
        {workerSrc && (
          <Worker workerUrl={workerSrc}>
            <div className="pdf-viewer">
              <Viewer
                fileUrl="/teach.pdf"
                onDocumentLoad={onDocumentLoadSuccess}
                defaultScale={SpecialZoomLevel.PageWidth}
                initialPage={pageNumber - 1}
              />
            </div>
          </Worker>
        )}
        <div className="page-info">
          Page {pageNumber} of {numPages}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
