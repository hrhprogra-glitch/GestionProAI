import { useState, useRef } from 'react';

interface DocumentUploaderProps {
  onFilesUpdated: (files: File[]) => void;
}

export default function DocumentUploader({ onFilesUpdated }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => f.type === 'application/pdf');
    
    if (validFiles.length !== fileArray.length) {
      alert('⚠️ Solo se permiten archivos PDF. Los demás formatos han sido ignorados.');
    }
    
    if (validFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(updatedFiles);
      onFilesUpdated(updatedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    onFilesUpdated(updatedFiles);
  };

  return (
    <div 
      className={`relative w-full h-36 p-3 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
        isDragging 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        // Evita abrir la ventana de archivos si el usuario hizo clic en el botón de eliminar (X)
        if ((e.target as HTMLElement).closest('button')) return;
        fileInputRef.current?.click();
      }}
    >
      <input type="file" ref={fileInputRef} onChange={handleChange} accept=".pdf" multiple className="hidden" />

      {selectedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="w-10 h-10 mb-2 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Añadir PDFs de Respaldo</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Haz clic o arrastra los archivos aquí</p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-purple-200 dark:border-purple-900/30">
            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Adjuntos ({selectedFiles.length})
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 px-2 py-0.5 rounded transition-colors">
              + Añadir más
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-900 pr-1">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate pr-2 flex-1 text-left">
                  📄 {file.name}
                </span>
                <button 
                  onClick={(e) => removeFile(idx, e)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-slate-100 dark:bg-slate-800 rounded-md shrink-0"
                  title="Eliminar PDF"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}