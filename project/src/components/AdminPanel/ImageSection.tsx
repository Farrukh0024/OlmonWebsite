import React, { useState } from 'react';
import { Upload, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageData {
  id: string;
  url: string;
  alt: string;
  description?: string;
}

interface ImageSectionProps {
  title: string;
  images: ImageData[];
  onUpdate: (images: ImageData[]) => void;
  maxImages?: number;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  title,
  images,
  onUpdate,
  maxImages
}) => {
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Resim boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const newImage: ImageData = {
          id: Date.now().toString(),
          url: event.target.result,
          alt: file.name,
          description: ''
        };

        if (maxImages && images.length >= maxImages) {
          onUpdate([newImage]);
        } else {
          onUpdate([...images, newImage]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    onUpdate(images.filter(img => img.id !== id));
  };

  const handleEdit = (image: ImageData) => {
    setEditingImage(image);
  };

  const handleSaveEdit = (editedImage: ImageData) => {
    onUpdate(images.map(img => img.id === editedImage.id ? editedImage : img));
    setEditingImage(null);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map(image => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleEdit(image)}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <Edit2 className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}

        {(!maxImages || images.length < maxImages) && (
          <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Resim Yükle</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      <AnimatePresence>
        {editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h4 className="text-lg font-semibold mb-4">Resim Düzenle</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Metni
                  </label>
                  <input
                    type="text"
                    value={editingImage.alt}
                    onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={editingImage.description || ''}
                    onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingImage(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleSaveEdit(editingImage)}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};