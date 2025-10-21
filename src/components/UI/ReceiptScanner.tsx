import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X } from 'lucide-react';
import { useState } from 'react';
import Tesseract from 'tesseract.js';

interface ReceiptScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: { amount?: number; description?: string; date?: string }) => void;
}

export function ReceiptScanner({ isOpen, onClose, onScanComplete }: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: false,
  });

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);

      // Stop camera
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
    }
  };

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text;

      // Extract amount (looks for currency patterns)
      const amountMatch = text.match(/\$?\s*(\d+\.?\d{0,2})/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined;

      // Extract date (basic pattern)
      const dateMatch = text.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
      const date = dateMatch ? dateMatch[1] : undefined;

      // Get first meaningful line as description
      const lines = text.split('\n').filter(line => line.trim().length > 3);
      const description = lines[0]?.trim() || 'Receipt scan';

      onScanComplete({ amount, description, date });
      onClose();
      setImage(null);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Scan Receipt
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {!image ? (
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">
                      {isDragActive
                        ? 'Drop the receipt here'
                        : 'Drag & drop a receipt image'}
                    </p>
                    <p className="text-white/60 text-sm">or click to browse</p>
                  </div>

                  <div className="text-center">
                    <p className="text-white/60 mb-3">OR</p>
                    <button
                      onClick={handleCameraCapture}
                      className="btn btn-primary flex items-center gap-2 mx-auto"
                    >
                      <Camera className="w-5 h-5" />
                      Take Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt="Receipt"
                      className="w-full h-auto max-h-96 object-contain bg-black/20"
                    />
                    {!isProcessing && (
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-white/80">
                        <span>Processing receipt...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setImage(null)}
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      Choose Different Image
                    </button>
                    <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="flex-1 btn btn-primary disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Scan Receipt'}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Tip:</strong> For best results, ensure the receipt is well-lit and all
                  text is clearly visible. The scanner will extract amount, date, and description.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
