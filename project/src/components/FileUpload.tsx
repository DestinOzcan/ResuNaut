import React, { useCallback, useState } from 'react';
import { Upload, Rocket, X, Check, Star, AlertCircle } from 'lucide-react';
import { Resume } from '../types';
import { parseFile } from '../utils/fileParser';

interface FileUploadProps {
  onFileUpload: (resume: Resume) => void;
  uploadedFile?: Resume;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process the file';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const removeFile = () => {
    setError(null);
    // Reset file upload - this would need to be handled by parent component
  };

  if (error) {
    return (
      <div className="border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-400">Upload Failed</h3>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setError(null)}
          className="mt-4 w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (uploadedFile) {
    return (
      <div className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{uploadedFile.fileName}</h3>
              <p className="text-sm text-blue-400">
                Uploaded {uploadedFile.uploadedAt.toLocaleTimeString()} • {Math.round(uploadedFile.content.length / 1000)}k characters
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        isDragOver
          ? 'border-blue-400/50 bg-blue-500/10'
          : isUploading
          ? 'border-purple-400/50 bg-purple-500/10'
          : 'border-gray-700 hover:border-gray-600 bg-gray-900/30'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/25">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Preparing for Launch</h3>
            <p className="text-purple-400">Analyzing resume structure and content...</p>
          </div>
          <div className="w-64 mx-auto bg-gray-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Upload Your Resume</h3>
            <p className="text-gray-400">
              Drag and drop your resume here, or{' '}
              <label className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium transition-colors">
                browse files
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, DOC, DOCX, and TXT files
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Star className="w-3 h-3" />
            <span>Ready for cosmic optimization</span>
          </div>
        </div>
      )}
    </div>
  );
};