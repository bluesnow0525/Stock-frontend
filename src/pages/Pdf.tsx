// src/pdf.tsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Viewer, Worker, SpecialZoomLevel, DocumentLoadEvent } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Button } from 'react-bootstrap';
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';

// 设置 PDF.js worker 路径
const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(await import('pdfjs-dist')).version}/pdf.worker.js`;

const PdfViewer = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [username, setusername] = useState(location.state ? (location.state as { username: string }).username : undefined);
    const [isvip, setisvip] = useState(location.state ? (location.state as { isvip: Boolean }).isvip : undefined);

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
        setPageNumber(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prevPage => Math.min(prevPage + 1, numPages ?? 1));
    };

    return (
        <div>
            <AnimatedComponent y={-100} opacity={0} duration={0.8}>
                <Header username={username} isvip={isvip} onUpdateUserInfo={updateUserInfo}></Header>
            </AnimatedComponent>
            <div className="pdf-controls">
                <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    上一頁
                </Button>
                <Button onClick={goToNextPage} disabled={pageNumber >= (numPages ?? 1)}>
                    下一頁
                </Button>
            </div>
            <Worker workerUrl={workerSrc}>
                <div className="pdf-viewer">
                    <Viewer
                        fileUrl="/sample.pdf"
                        onDocumentLoad={onDocumentLoadSuccess}
                        defaultScale={SpecialZoomLevel.PageWidth}
                        initialPage={pageNumber - 1}
                    />
                </div>
            </Worker>
            <div className="page-info">
                Page {pageNumber} of {numPages}
            </div>
        </div>
    );
};

export default PdfViewer;
