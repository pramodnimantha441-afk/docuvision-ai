import React, { useContext, useState } from 'react';
import { 
  Download, ZoomIn, ZoomOut, Move, RotateCw, Bold, Italic, List, 
  Home, Moon, Sun, FileText, CheckSquare, Target, Key, Clock, 
  FileType, Sparkles, Loader2, Scan, CheckCircle2, ShieldCheck,
  Maximize2, Cpu, Eye, ArrowLeft, Plus, Upload
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DualPaneWorkspace = ({ onNavigate }) => {
  const { 
    editorContent, 
    setEditorContent, 
    uploadedFile, 
    summaryData, 
    isProcessing, 
    processingStep, 
    processingProgress,
    isDownloading,
    downloadAsDocx 
  } = useContext(AppContext);
  
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  return (
    <div className="h-screen bg-slate-900 light:bg-slate-50 flex flex-col transition-colors duration-300 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-slate-800/80 light:bg-white/80 backdrop-blur-xl border-b border-slate-700/60 light:border-slate-200 px-6 py-3.5 shadow-md z-30 transition-colors duration-300">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 light:bg-indigo-50 border border-indigo-500/30 rounded-xl text-indigo-400 light:text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 light:text-slate-900 truncate max-w-md">
                {uploadedFile?.name || 'Handwritten Document Workspace'}
              </h1>
              <p className="text-xs text-slate-400 light:text-slate-500 flex items-center gap-2">
                <span>DocuVision AI Neural Pipeline</span>
                {isProcessing && (
                  <span className="inline-flex items-center gap-1 text-cyan-400 animate-pulse font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Live Scanning...
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Back Button to scan next document */}
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-3.5 py-2 bg-slate-700/60 hover:bg-slate-700 light:bg-slate-200 light:hover:bg-slate-300 text-slate-200 light:text-slate-800 rounded-xl transition-all font-medium text-xs flex items-center gap-2 border border-slate-600/50 light:border-slate-300 shadow-sm"
              title="Back to Dashboard to scan another document"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400 light:text-indigo-600" />
              <span>Back</span>
            </button>

            {/* Scan New Document button */}
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 light:bg-indigo-50 light:hover:bg-indigo-100 text-indigo-300 light:text-indigo-700 rounded-xl transition-all font-medium text-xs flex items-center gap-2 border border-indigo-500/30 shadow-sm"
              title="Scan another handwritten document"
            >
              <Plus className="w-4 h-4 text-indigo-400 light:text-indigo-600" />
              <span>Scan Next Photo</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-700/50 light:hover:bg-slate-100 rounded-xl transition-all text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-slate-700/40 light:border-slate-200"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-3.5 py-2 hover:bg-slate-700/50 light:hover:bg-slate-100 text-slate-300 light:text-slate-700 rounded-xl transition-all font-medium text-xs flex items-center gap-2 border border-slate-700/40 light:border-slate-200"
              title="Go to Dashboard"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Robust Word Docx Download */}
            <button
              onClick={() => downloadAsDocx()}
              disabled={isDownloading || isProcessing || !editorContent}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compiling .docx...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .docx</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT PANE: Source Image & Scanning Animation ── */}
        <div className="w-1/2 bg-slate-950/80 light:bg-slate-100/70 border-r border-slate-800 light:border-slate-200 flex flex-col relative transition-colors duration-300">
          
          {/* Top Viewer Toolbar */}
          <div className="bg-slate-900/90 light:bg-white/90 border-b border-slate-800 light:border-slate-200 px-4 py-2 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-indigo-400" />
                Original Document
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800/80 light:bg-slate-100 p-1 rounded-lg border border-slate-700/50 light:border-slate-200 text-xs">
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-700 light:hover:bg-slate-200 rounded text-slate-300 light:text-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-slate-400 light:text-slate-600 min-w-[45px] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-700 light:hover:bg-slate-200 rounded text-slate-300 light:text-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-700 light:hover:bg-slate-200 rounded text-slate-300 light:text-slate-700 ml-1 border-l border-slate-700/60 light:border-slate-300 pl-1.5"
                title="Reset View"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Image Display Area with Laser Scanner Effect */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center relative select-none">
            {uploadedFile?.preview ? (
              <div 
                className="relative transition-transform duration-150 inline-block"
                style={{ transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)` }}
              >
                {/* The Uploaded Image */}
                <div className={`relative rounded-xl overflow-hidden border-2 shadow-2xl transition-all duration-500 ${
                  isProcessing 
                    ? 'border-cyan-500/80 shadow-cyan-500/20' 
                    : 'border-slate-700/80 light:border-slate-300'
                }`}>
                  <img
                    src={uploadedFile.preview}
                    alt="Uploaded handwritten source"
                    className="max-h-[68vh] max-w-full object-contain block rounded-lg"
                  />

                  {/* ── HIGH-TECH LASER SCAN ANIMATION OVERLAY ── */}
                  {isProcessing && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                      {/* Dark futuristic tint */}
                      <div className="absolute inset-0 bg-indigo-950/20 backdrop-brightness-95"></div>

                      {/* Sci-Fi Grid lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#818cf815_1px,transparent_1px),linear-gradient(to_bottom,#818cf815_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                      {/* Laser Beam sweeping up and down */}
                      <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee,0_0_35px_#06b6d4] animate-laser-scan">
                        {/* Laser point glows */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-24 h-4 bg-cyan-400/40 rounded-full blur-md"></div>
                      </div>

                      {/* Corner Target Reticles */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

                      {/* Floating Scan Status Badge */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-300 border border-cyan-500/50 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xl backdrop-blur-md animate-bounce">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        <span>
                          {processingStep === 1 && 'Adaptive Contrast & Line Subtraction...'}
                          {processingStep === 2 && 'EasyOCR & TrOCR Transformer Inference...'}
                          {processingStep === 3 && 'Flan-T5 Abstractive NLP Summarization...'}
                          {processingStep >= 4 && 'Digitization Finalized!'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 light:text-slate-400">
                <Scan className="w-16 h-16 mx-auto mb-3 opacity-40 animate-pulse" />
                <p className="text-sm font-medium">No document loaded</p>
                <p className="text-xs mt-1">Upload a handwriting photo from Dashboard</p>
              </div>
            )}
          </div>

          {/* Bottom Scanner Status Bar */}
          {isProcessing && (
            <div className="bg-slate-900 border-t border-slate-800 p-3 flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-2 text-cyan-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Digitizing handwritten document ({processingProgress}%)...</span>
              </div>
              <div className="w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANE: Extracted Content & AI Summary ── */}
        <div className="w-1/2 bg-slate-900 light:bg-white flex flex-col overflow-y-auto transition-colors duration-300">
          
          {/* AI Insights & Summary Section (Collapsible / Top Card) */}
          {summaryData && summaryData.summary && (
            <div className="p-6 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 light:from-indigo-50 light:via-purple-50 light:to-white border-b border-slate-800 light:border-slate-200">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 light:text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    Flan-T5 Abstractive Summary
                  </span>
                  {summaryData.content_type && (
                    <span className="px-2.5 py-1 bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700 rounded-lg text-xs font-medium uppercase tracking-wider">
                      {summaryData.content_type.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {summaryData.reading_time_sec && (
                  <span className="text-xs text-slate-400 light:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{summaryData.reading_time_sec}s read
                  </span>
                )}
              </div>

              {/* Executive Summary Paragraph */}
              <div className="bg-slate-800/70 light:bg-white p-4 rounded-xl border border-slate-700/60 light:border-slate-200 shadow-sm mb-4">
                <h3 className="text-xs font-bold text-indigo-400 light:text-indigo-600 uppercase tracking-wider mb-2">
                  Executive Summary
                </h3>
                <p className="text-sm text-slate-200 light:text-slate-800 leading-relaxed">
                  {summaryData.summary}
                </p>
              </div>

              {/* Key Points Grid */}
              {summaryData.key_points && summaryData.key_points.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 light:text-slate-600 uppercase tracking-wider">
                    Key Highlights
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {summaryData.key_points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-700 bg-slate-800/40 light:bg-slate-100 p-2.5 rounded-lg border border-slate-700/40 light:border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Header */}
          <div className="bg-slate-900/90 light:bg-slate-100/90 border-b border-slate-800 light:border-slate-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 light:text-slate-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Digitized Text Editor
            </span>
            <span className="text-xs text-slate-500">
              {editorContent ? `${editorContent.replace(/<[^>]*>/g, '').length} characters` : '0 characters'}
            </span>
          </div>

          {/* React Quill Rich Text Editor */}
          <div className="flex-1 p-6 flex flex-col">
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={setEditorContent}
              modules={quillModules}
              placeholder="Digitized handwriting transcription will appear here. You can edit, format, or adjust text before downloading..."
              className="flex-1 rounded-xl bg-slate-800/30 light:bg-white border border-slate-700/50 light:border-slate-300"
              style={{ minHeight: '380px' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DualPaneWorkspace;
