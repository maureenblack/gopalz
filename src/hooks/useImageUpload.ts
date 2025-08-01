import { useState, useCallback } from 'react';

interface ImageFile extends File {
  preview?: string;
}

export function useImageUpload(maxFiles: number = 5) {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string>('');

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      
      // Validate file types
      const invalidFiles = selectedFiles.filter(
        file => !file.type.startsWith('image/')
      );
      if (invalidFiles.length > 0) {
        setError('Please upload only image files');
        return;
      }

      // Validate file size (5MB limit)
      const oversizedFiles = selectedFiles.filter(
        file => file.size > 5 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError('Images must be less than 5MB');
        return;
      }

      // Validate number of files
      if (files.length + selectedFiles.length > maxFiles) {
        setError(`You can upload a maximum of ${maxFiles} images`);
        return;
      }

      setError('');

      // Create preview URLs
      const newFiles = selectedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));

      setFiles(prev => [...prev, ...newFiles]);
    },
    [files.length, maxFiles]
  );

  const removeImage = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview!);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const clearImages = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setError('');
  }, [files]);

  return {
    files,
    error,
    handleImageChange,
    removeImage,
    clearImages
  };
}
