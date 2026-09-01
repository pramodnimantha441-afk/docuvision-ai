import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { transcribeImage, saveDocument, getUserDocuments, exportDocxFile } from '../services/api';
import { useAuth } from './AuthContext';
import { ref, get } from 'firebase/database';
import { db } from '../config/firebase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentFile, setCurrentFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [processingMode, setProcessingMode] = useState('transcription'); // 'transcription' or 'summarization'
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadDocumentsFromDB();
    }
  }, [currentUser]);

  const loadDocumentsFromDB = async () => {
    try {
      if (!currentUser || currentUser.isGuest) return;
      const snapshot = await get(ref(db, `documents/${currentUser.uid}`));
      if (snapshot.exists()) {
        const docsObj = snapshot.val();
        const docsArray = Object.keys(docsObj).map(key => ({
          id: key,
          ...docsObj[key]
        }));
        docsArray.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
        setRecentDocuments(docsArray);
      } else {
        setRecentDocuments([]);
      }
    } catch (error) {
      console.warn("DB read note:", error);
    }
  };

  const logout = () => {
    setCurrentFile(null);
    setUploadedFile(null);
    setEditorContent('');
    setSummaryData(null);
    setShowProcessingModal(false);
    setProcessingProgress(0);
    setProcessingStep(0);
    setIsProcessing(false);
    setRecentDocuments([]);
  };

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile({
          name: file.name,
          preview: reader.result,
          file: file,
        });
        setCurrentFile(file);
        setShowProcessingModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = (file) => {
    setCurrentFile(file);
    setShowProcessingModal(true);
  };

  const startProcessing = async () => {
    if (!currentFile) return;
    
    setIsProcessing(true);
    setProcessingProgress(10);
    setProcessingStep(1);
    setSummaryData(null);
    
    // Simulate smooth progress steps for the scanner UI
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev < 30) {
          setProcessingStep(1); // Preprocessing & CLAHE
          return prev + 5;
        } else if (prev < 70) {
          setProcessingStep(2); // CRAFT Line Detection & TrOCR
          return prev + 4;
        } else if (prev < 90) {
          setProcessingStep(3); // Flan-T5 Abstractive NLP
          return prev + 2;
        }
        return prev;
      });
    }, 400);

    try {
      const result = await transcribeImage(currentFile, processingMode);
      
      clearInterval(interval);
      setProcessingProgress(100);
      setProcessingStep(4); // Complete

      const extracted = result.transcribed_text || result.text || '';
      
      // Convert plain text newlines and list structures into clean HTML for ReactQuill
      const formatExtractedToHtml = (rawText) => {
        if (!rawText) return '';
        if (rawText.startsWith('<p>') || rawText.startsWith('<div>') || rawText.startsWith('<h1>') || rawText.startsWith('<h3>')) {
          return rawText;
        }
        const lines = rawText.split('\n');
        const htmlParts = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) {
            htmlParts.push('<p><br></p>');
            continue;
          }

          // Detect bullet points
          if (/^[•\-\*]\s+/.test(line)) {
            const cleanBullet = line.replace(/^[•\-\*]\s+/, '');
            htmlParts.push(`<p>• ${cleanBullet}</p>`);
          }
          // Detect numbering like "02) ", "1. ", "a) "
          else if (/^(\d+[\.\)]|[a-zA-Z][\.\)])\s+/.test(line)) {
            const match = line.match(/^(\d+[\.\)]|[a-zA-Z][\.\)])\s+(.*)$/);
            if (match) {
              htmlParts.push(`<p><strong>${match[1]}</strong> ${match[2]}</p>`);
            } else {
              htmlParts.push(`<p><strong>${line}</strong></p>`);
            }
          }
          // Detect section titles / headings (short lines ending in colon or topic titles)
          else if ((line.endsWith(':') || /^(topic|chapter|part|section|management|strategic|tactical|operational)\b/i.test(line)) && line.length < 50) {
            htmlParts.push(`<p><strong>${line}</strong></p>`);
          }
          // Regular line
          else {
            htmlParts.push(`<p>${line}</p>`);
          }
        }
        return htmlParts.join('');
      };

      const formattedContent = formatExtractedToHtml(extracted);
      setEditorContent(formattedContent);
      setSummaryData(result);
      
      // Save document to DB
      try {
        const newDoc = {
          name: currentFile.name,
          date: new Date().toISOString(),
          status: 'Completed',
          transcribed_text: extracted,
          ...result
        };
        await saveDocument(newDoc);
        loadDocumentsFromDB();
      } catch (err) {
        console.warn("Save doc notice:", err);
      }
      
      toast.success('Document digitized successfully!');
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      toast.error('Failed to process document. Please check connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const addRecentDocument = (doc) => {
    setRecentDocuments(prev => [doc, ...prev.slice(0, 9)]);
  };

  const downloadAsDocx = async (customTitle) => {
    if (!editorContent || !editorContent.trim()) {
      toast.error('No transcribed text to export!');
      return;
    }

    setIsDownloading(true);
    const toastId = toast.loading('Generating Word (.docx) document...');

    const docTitle = customTitle || uploadedFile?.name?.replace(/\.[^/.]+$/, '') || 'DocuVision_Transcribed_Doc';
    const cleanFileName = `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;

    // Client-side fallback export helper
    const triggerClientFallbackDownload = () => {
      const plainText = editorContent
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      const wordHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${docTitle}</title>
<style>
  body { font-family: 'Calibri', 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.5; color: #222222; margin: 1in; }
  h1 { font-size: 20pt; color: #1a237e; margin-bottom: 4px; font-weight: bold; }
  .meta { font-size: 9.5pt; color: #5a646e; font-style: italic; margin-bottom: 20px; }
  h2 { font-size: 13pt; color: #283593; margin-top: 18px; margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
  .summary-box { background-color: #f0f4ff; border-left: 4px solid #3f51b5; padding: 10px 14px; margin: 10px 0 16px 0; border-radius: 4px; }
  .content p { margin: 0 0 6px 0; }
</style>
</head>
<body>
  <h1>${docTitle}</h1>
  <p class="meta">Digitized on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}  |  DocuVision AI Workspace</p>
  ${summaryData?.summary ? `<h2>1.0 AI Executive Summary</h2><div class="summary-box">${summaryData.summary}</div>` : ''}
  <h2>2.0 Extracted Handwritten Transcription</h2>
  <div class="content">${editorContent}</div>
</body>
</html>`;

      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword;charset=utf-8'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', cleanFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    try {
      const payload = {
        title: docTitle,
        text: editorContent,
        summary: summaryData?.summary || '',
        key_points: summaryData?.key_points || [],
        action_items: summaryData?.action_items || [],
        image_base64: (uploadedFile?.preview && uploadedFile.preview.length < 3000000) ? uploadedFile.preview : ''
      };

      const blobData = await exportDocxFile(payload);
      
      const url = window.URL.createObjectURL(new Blob([blobData], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', cleanFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Word document downloaded successfully!', { id: toastId });
    } catch (error) {
      console.warn('Backend docx export notice, using high-fidelity client document generator:', error);
      try {
        triggerClientFallbackDownload();
        toast.success('Word document generated and downloaded!', { id: toastId });
      } catch (fallbackError) {
        console.error('All document export attempts failed:', fallbackError);
        toast.error('Failed to generate document file.', { id: toastId });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentFile,
        uploadedFile,
        recentDocuments,
        editorContent,
        summaryData,
        processingMode,
        processingProgress,
        processingStep,
        showProcessingModal,
        isProcessing,
        isDownloading,
        logout,
        uploadFile,
        handleFileUpload,
        startProcessing,
        addRecentDocument,
        downloadAsDocx,
        setProcessingMode,
        setEditorContent,
        setSummaryData,
        setShowProcessingModal,
        loadDocumentsFromDB,
        setUploadedFile,
        setCurrentFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
