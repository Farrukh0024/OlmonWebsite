import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Phone, Instagram, Send, GraduationCap, School, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedImage from './components/AnimatedImage';
import AnimatedButton from './components/AnimatedButton';
import { HERO, LOGO, RESULTS, LOCATION_IMAGES } from './constants/images';

const CourseForm = lazy(() => import('./components/CourseForm'));
const ExamForm = lazy(() => import('./components/ExamForm'));

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  </div>
);

function App() {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (showCourseForm || showExamForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCourseForm, showExamForm]);

  useEffect(() => {
    const imagesToPreload = [HERO.url, LOGO.url];
    Promise.all(
      imagesToPreload.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      })
    ).then(() => setIsLoaded(true))
    .catch(error => {
      console.error('Error loading images:', error);
      setIsLoaded(true); // Still set loaded to true to not block rendering
    });
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Olmon Akademiyasi - Nemis tili o'quv markazi</title>
        <meta name="description" content="O'zbekistondagi eng katta nemis tili o'quv markazlaridan biri. Kuchli ustozlar, unikal metodika, samarali darslar va yuqori natijalar!" />
        <link rel="canonical" href={currentUrl} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content="Olmon Akademiyasi - Nemis tili o'quv markazi" />
        <meta property="og:description" content="O'zbekistondagi eng katta nemis tili o'quv markazlaridan biri. Kuchli ustozlar, unikal metodika, samarali darslar va yuqori natijalar!" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content="Olmon Akademiyasi - Nemis tili o'quv markazi" />
        <meta name="twitter:description" content="O'zbekistondagi eng katta nemis tili o'quv markazlaridan biri" />
      </Helmet>

      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 bg-yellow-500 text-black py-2 px-4 text-center z-50"
        >
          Internet aloqasi yo'q. Offline rejimda ishlamoqda.
        </motion.div>
      )}

      <div className="min-h-screen">
        {/* Hero Section */}
        <div 
          className="min-h-[90vh] bg-cover bg-center relative flex items-center"
          style={{
            backgroundImage: `url("${HERO.url}")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
          <div className="container relative z-10 py-16 md:py-24">
            <motion.div 
              className="flex flex-col items-center text-center text-white max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.img 
                src={LOGO.url} 
                alt={LOGO.alt}
                className="w-24 h-24 md:w-32 md:h-32 mb-8 animate-float"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              />
              <motion.div 
                className="w-24 h-1 bg-accent mb-8"
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.h1 
                className="heading-1 mb-6"
                {...fadeInUp}
                transition={{ delay: 0.5 }}
              >
                Nemis tilini O'zbekistondagi shu yo'nalish bo'yicha eng katta o'quv markazlardan birida o'rganing
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl mb-12 text-gray-200"
                {...fadeInUp}
                transition={{ delay: 0.7 }}
              >
                Kuchli ustozlar, unikal metodika, samalari darslar va yuqori natijalar!
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Info Section */}
        <section className="section bg-primary/10">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <motion.div 
                className="card p-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading-2 mb-4">Kurslarimiz haqida qisqacha</h2>
                <p className="text-text-light mb-6">
                  O'quv markazimizda A1 dan (boshlang'ich daraja) boshlab C1 gacha bo'lgan darajadagi o'quvchilar uchun guruhlar mavjud. Bizda ham offline, ham online kurslar bor.
                </p>
                <AnimatedButton
                  onClick={() => setShowCourseForm(true)}
                  variant="accent"
                  className="w-full md:w-auto"
                >
                  <School className="w-5 h-5" />
                  <span>Kursga yozilish</span>
                </AnimatedButton>
              </motion.div>

              <motion.div 
                className="card p-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading-2 mb-4">Test markazimiz haqida</h2>
                <p className="text-text-light mb-6">
                  Imtihon markazimiz O'zbekistonda birinchilardan bo'lib ruhsatnoma olishga muvaffaq bo'lgan va hozirgacha 1500 dan ortiq yurtdoshlarimiz bizda imtihon topshirishga ulgurgan.
                </p>
                <AnimatedButton
                  onClick={() => setShowExamForm(true)}
                  variant="accent"
                  className="w-full md:w-auto"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Imtihonga yozilish</span>
                </AnimatedButton>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="section bg-background">
          <div className="container">
            <motion.div 
              className="text-center mb-12"
              {...fadeInUp}
            >
              <h2 className="heading-2 mb-4">Natijalarimiz</h2>
              <p className="text-text-light">O'quvchilarimiz doimiy ravishda yuqori natijalarga erishib kelishadi</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {RESULTS.slice(0, 7).map((result, i) => (
                <AnimatedImage
                  key={i}
                  src={result.url}
                  alt={result.alt}
                  className="w-full"
                />
              ))}
              <AnimatedButton
                href="https://t.me/oanatija"
                variant="accent"
                className="aspect-[3/5] flex flex-col items-center justify-center text-lg font-medium group"
              >
                <span className="text-center">Ko'proq natijalarni ko'rish</span>
                <ArrowRight className="w-6 h-6 mt-2 group-hover:translate-x-1 transition-transform" />
              </AnimatedButton>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="section bg-primary/10">
          <div className="container">
            <motion.h2 
              className="heading-2 text-center mb-12"
              {...fadeInUp}
            >
              Manzil
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "1-filial",
                  address: LOCATION_IMAGES.LOCATION_1.description,
                  image: LOCATION_IMAGES.LOCATION_1
                },
                {
                  title: "2-filial",
                  address: LOCATION_IMAGES.LOCATION_2.description,
                  image: LOCATION_IMAGES.LOCATION_2
                },
              ].map((location, i) => (
                <motion.div 
                  key={i} 
                  className="card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                >
                  <h3 className="text-xl font-bold mb-4 text-accent">{location.title}</h3>
                  <p className="flex items-start gap-2 mb-4 text-text-light">
                    <MapPin className="w-5 h-5 flex-shrink-0 text-accent" />
                    {location.address}
                  </p>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={location.image.url} 
                      alt={location.image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div 
                className="flex items-center gap-3 text-text-light"
                {...fadeInUp}
              >
                <Clock className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-semibold">Ish vaqti</p>
                  <p>Du-Sha: 08:00 - 22:00</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 text-text-light"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <Phone className="w-6 h-6 text-accent" />
                <div>
                  <p>+998 90 336-62-22</p>
                  <p>+998 94 036-62-22</p>
                </div>
              </motion.div>
              <AnimatedButton
                href="https://instagram.com/olmon_akademiyasi"
                variant="link"
                className="flex items-center gap-3"
              >
                <Instagram className="w-6 h-6" />
                <span>@olmon_akademiyasi</span>
              </AnimatedButton>
              <AnimatedButton
                href="https://t.me/manzil_olmon_akademie"
                variant="link"
                className="flex items-center gap-3"
              >
                <Send className="w-6 h-6" />
                <span>Telegram</span>
              </AnimatedButton>
            </div>
          </div>
        </section>

        {/* Forms */}
        <AnimatePresence>
          {showCourseForm && (
            <Suspense fallback={<LoadingSpinner />}>
              <CourseForm onClose={() => setShowCourseForm(false)} />
            </Suspense>
          )}
          {showExamForm && (
            <Suspense fallback={<LoadingSpinner />}>
              <ExamForm onClose={() => setShowExamForm(false)} />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;