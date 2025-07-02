import React, { useCallback, useState } from 'react';
import { Upload, Rocket, X, Check, Star, AlertCircle } from 'lucide-react';
import { Resume } from '../types';
import { parseFile } from '../utils/fileParser';
import { AccessibleButton } from './ui/AccessibleButton';
import { VisuallyHidden } from './accessibility/VisuallyHidden';
import { useAnnouncement } from '../hooks/useAnnouncement';
import { LiveRegion } from './accessibility/LiveRegion';

interface FileUploadProps {
  onFileUpload: (resume: Resume) => void;
  uploadedFile?: Resume;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { announcement, announce } = useAnnouncement();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    announce('Processing file upload, please wait...');
    
    try {
      // Parse the actual file content
      const content = await parseFile(file);
      
      if (!content || content.trim().length < 50) {
        throw new Error('The file appears to be empty or too short. Please upload a complete resume.');
      }
      
      const resume: Resume = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type,
        content: content,
        uploadedAt: new Date()
      };
      
      onFileUpload(resume);
      announce(`File ${file.name} uploaded successfully. ${Math.round(content.length / 1000)}k characters processed.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process the file';
      setError(errorMessage);
      announce(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload, announce]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const removeFile = () => {
    setError(null);
    announce('File removed. You can upload a new file.');
    // Reset file upload - this would need to be handled by parent component
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      fileInput?.click();
    }
  };

  if (error) {
    return (
      <>
        <LiveRegion message={announcement} />
        <div 
          className="border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-xl p-6"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-400">Upload Failed</h3>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
            <AccessibleButton
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              ariaLabel="Dismiss error message"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <X className="w-5 h-5" />
            </AccessibleButton>
          </div>
          <AccessibleButton
            onClick={() => setError(null)}
            variant="secondary"
            className="mt-4 w-full bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
          >
            Try Again
          </AccessibleButton>
        </div>
      </>
    );
  }

  if (uploadedFile) {
    return (
      <>
        <LiveRegion message={announcement} />
        <div 
          className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Check className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{uploadedFile.fileName}</h3>
                <p className="text-sm text-blue-400">
                  Uploaded {uploadedFile.uploadedAt.toLocaleTimeString()} • {Math.round(uploadedFile.content.length / 1000)}k characters
                </p>
              </div>
            </div>
            <AccessibleButton
              variant="ghost"
              size="sm"
              onClick={removeFile}
              ariaLabel={`Remove uploaded file ${uploadedFile.fileName}`}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </AccessibleButton>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LiveRegion message={announcement} />
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400/50 bg-blue-500/10'
            : isUploading
            ? 'border-purple-400/50 bg-purple-500/10'
            : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Upload resume file. Drag and drop or press Enter to browse files."
        aria-describedby="upload-instructions"
      >
        {isUploading ? (
          <div className="space-y-4" role="status" aria-live="polite">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/25">
              <Rocket className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Preparing for Launch</h3>
              <p className="text-purple-400">Analyzing resume structure and content...</p>
            </div>
            <div className="w-64 mx-auto bg-gray-800 rounded-full h-2" role="progressbar" aria-label="Upload progress">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <VisuallyHidden>
              <p aria-live="polite">Processing file upload, please wait...</p>
            </VisuallyHidden>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
              <Upload className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Upload Your Resume</h3>
              <p className="text-gray-400" id="upload-instructions">
                Drag and drop your resume here, or{' '}
                <label className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-950 rounded">
                  browse files
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="sr-only"
                    aria-describedby="file-types"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-2" id="file-types">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Star className="w-3 h-3" aria-hidden="true" />
              <span>Ready for cosmic optimization</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};