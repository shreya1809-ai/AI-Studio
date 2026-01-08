import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept = ".pdf", onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const selectedFile = e.dataTransfer.files[0];
        setFile(selectedFile);
        onFileSelect(selectedFile);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold text-stone-600 mb-2">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer group
          ${file 
            ? 'border-green-400 bg-green-50/50' 
            : 'border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50'
          }
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          className="hidden" 
        />
        
        <div className="flex flex-col items-center text-center">
          {file ? (
            <>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <FileText size={24} />
              </div>
              <p className="text-stone-800 font-medium truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <CheckCircle size={12} className="mr-1" /> Ready
              </p>
              <button 
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 bg-white rounded-full text-stone-400 hover:text-red-500 shadow-sm border border-stone-100"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-stone-100 text-stone-400 group-hover:text-stone-500 rounded-full flex items-center justify-center mb-2 transition-colors">
                <Upload size={24} />
              </div>
              <p className="text-stone-600 font-medium">Click to upload</p>
              <p className="text-xs text-stone-400 mt-1">or drag & drop PDF</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
