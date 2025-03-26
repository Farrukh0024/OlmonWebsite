import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageSection } from './ImageSection';
import { imageStorage } from '../../utils/imageStorage';

interface ImageData {
  id: string;
  section: string;
  url: string;
  alt: string;
  description?: string;
}

const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<Record<string, ImageData[]>>({
    hero: [],
    results: [],
    locations: []
  });

  const handleImageUpdate = async (section: string, updatedImages: ImageData[]) => {
    try {
      // Clear existing images for this section
      await imageStorage.clearSection(section);
      
      // Save new images
      await Promise.all(
        updatedImages.map(image => 
          imageStorage.saveImage({ ...image, section })
        )
      );

      setImages(prev => ({
        ...prev,
        [section]: updatedImages
      }));
    } catch (error) {
      console.error('Error updating images:', error);
      alert('Resimleri kaydederken bir hata oluştu');
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [hero, results, locations] = await Promise.all([
          imageStorage.getImagesBySection('hero'),
          imageStorage.getImagesBySection('results'),
          imageStorage.getImagesBySection('locations')
        ]);

        setImages({
          hero,
          results,
          locations
        });
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
        aria-label="Admin panelini aç"
      >
        <ImageIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto p-6 relative"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Resimleri Yönet</h2>

        <div className="space-y-8">
          <ImageSection
            title="Hero Bölümü"
            images={images.hero}
            onUpdate={(updatedImages) => handleImageUpdate('hero', updatedImages)}
            maxImages={1}
          />

          <ImageSection
            title="Sonuçlar Galerisi"
            images={images.results}
            onUpdate={(updatedImages) => handleImageUpdate('results', updatedImages)}
          />

          <ImageSection
            title="Lokasyon Resimleri"
            images={images.locations}
            onUpdate={(updatedImages) => handleImageUpdate('locations', updatedImages)}
            maxImages={2}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;