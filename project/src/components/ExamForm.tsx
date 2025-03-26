import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPhoneNumber, validatePhoneNumber } from '../utils/phoneUtils';

interface ExamFormProps {
  onClose: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    planToTake: '',
    canAttend: '',
    level: '',
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedNumber });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate phone number
    if (!validatePhoneNumber(formData.phone)) {
      setError("Noto'g'ri telefon raqami formati. Masalan: +998 90 123 45 67");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          type: 'exam',
          formData: {
            ...formData,
            phone: formData.phone.replace(/\s/g, '')
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }

      if (data.success) {
        alert('Muvaffaqiyatli yuborildi!');
        onClose();
      } else {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-900">ÖSD imtihoni uchun ro'yxatdan o'tish</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-900">ÖSD imtihonini topshirishni rejalashtiryapsizmi?</label>
            <select
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.planToTake}
              onChange={(e) => setFormData({ ...formData, planToTake: e.target.value })}
              required
            >
              <option value="">Tanlang</option>
              <option value="yes">Ha, aniq rejam bor</option>
              <option value="maybe">Hali qaror qabul qilmaganman, ko'proq ma'lumot kerak</option>
              <option value="no">Yo'q, boshqa oyda topshirishni rejalashtiryapman</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-900">Offline kelib imtihon topshira olasizmi?</label>
            <select
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.canAttend}
              onChange={(e) => setFormData({ ...formData, canAttend: e.target.value })}
              required
            >
              <option value="">Tanlang</option>
              <option value="yes">Ha, albatta</option>
              <option value="no">Yo'q, kela olmiman</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-900">Hozirgi nemis tili darajangiz</label>
            <select
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              required
            >
              <option value="">Tanlang</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-900">Ismingiz</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-900">Telefon raqamingiz</label>
            <input
              type="tel"
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              placeholder="+998 ** *** ** **"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-accent text-background py-2 rounded hover:bg-accent-dark transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExamForm;