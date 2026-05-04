import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS, GOOGLE_MAPS_REVIEW_LINK, fadeInUp, staggerContainer } from "@/lib/constants";
import { StarRating, viewportOnce } from "./shared";

const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ReviewCard = ({ review }) => (
  <div className="text-center">
    {review.photo && (
      <img src={review.photo} alt={review.name} className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-[#1F6AE1]/30" />
    )}
    <div className="flex justify-center mb-4">
      <StarRating rating={review.rating || 5} size="w-6 h-6" />
    </div>
    <p className="text-lg md:text-xl text-[#C9CDD3] mb-6 italic">"{review.text}"</p>
    <div>
      <p className="font-bold text-white text-lg">{review.name}</p>
      <p className="text-[#94A3B8] text-sm">{review.location}</p>
      {review.vehicle && <p className="text-[#1F6AE1] text-sm mt-1">{review.vehicle}</p>}
    </div>
  </div>
);

const ReviewNavigation = ({ reviews, currentIndex, onSelect, onPrev, onNext }) => (
  <div className="flex justify-center gap-4 mt-8">
    <button onClick={onPrev} className="p-3 rounded-full glass-card hover:bg-[#1F6AE1]/20 transition-colors" data-testid="review-prev">
      <ChevronLeft className="w-5 h-5 text-[#C9CDD3]" />
    </button>
    <div className="flex items-center gap-2">
      {reviews.map((review, idx) => (
        <button key={review.name} onClick={() => onSelect(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#1F6AE1] w-6' : 'bg-[#94A3B8]/50'}`} />
      ))}
    </div>
    <button onClick={onNext} className="p-3 rounded-full glass-card hover:bg-[#1F6AE1]/20 transition-colors" data-testid="review-next">
      <ChevronRight className="w-5 h-5 text-[#C9CDD3]" />
    </button>
  </div>
);

const formatApiReviews = (data) =>
  data.reviews.map((review) => ({
    name: review.author_name,
    location: "Google Maps",
    rating: review.rating,
    text: review.text,
    vehicle: review.relative_time_description || "",
    photo: review.profile_photo_url,
  }));

export const GoogleReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState(TESTIMONIALS);
  const [placeInfo, setPlaceInfo] = useState({ rating: 5.0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/google-reviews`);
      if (!response.ok) return;
      const data = await response.json();
      if (data.reviews?.length > 0) {
        setReviews(formatApiReviews(data));
        setPlaceInfo({ rating: data.rating, totalReviews: data.user_ratings_total });
      }
    } catch (error) {
      // Fallback testimonials used by default
      if (process.env.NODE_ENV === 'development') {
        console.warn('Google Reviews API unreachable', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const nextTestimonial = useCallback(() => setCurrentIndex((prev) => (prev + 1) % reviews.length), [reviews.length]);
  const prevTestimonial = useCallback(() => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length), [reviews.length]);

  return (
    <section className="py-6 md:py-8 bg-[#0F2A44]/20" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div>
          <div className="mb-6 md:mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GoogleIcon />
              <span className="text-[#1F6AE1] font-semibold tracking-wider text-sm">RESEÑAS EN GOOGLE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Lo que dicen nuestros <span className="text-[#1F6AE1]">clientes</span>
            </h2>
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
              <StarRating rating={placeInfo.rating} />
              <span className="text-white font-bold">{placeInfo.rating.toFixed(1)}</span>
              <span className="text-[#94A3B8]">
                {placeInfo.totalReviews > 0 ? `(${placeInfo.totalReviews} reseñas)` : 'en Google Maps'}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 md:p-12 rounded-3xl max-w-3xl mx-auto relative">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-[#1F6AE1]/20" />
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-[#1F6AE1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[#94A3B8]">Cargando reseñas...</p>
                </div>
              ) : (
                <>
                  <ReviewCard review={reviews[currentIndex]} />
                  {reviews.length > 1 && (
                    <ReviewNavigation reviews={reviews} currentIndex={currentIndex} onSelect={setCurrentIndex} onPrev={prevTestimonial} onNext={nextTestimonial} />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a href={GOOGLE_MAPS_REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 btn-primary text-white font-bold px-6 py-3 rounded-full transition-transform hover:scale-105" data-testid="leave-review-link">
              <Star className="w-5 h-5" />
              Déjanos tu reseña
            </a>
          </div>
          {/* Structured Data for SEO (Review Schema) */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Service",
              "name": "Street Prime Detail",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": placeInfo.rating || 5,
                "reviewCount": placeInfo.totalReviews || reviews.length
              },
              "review": reviews.slice(0, 5).map(r => ({
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": r.rating
                },
                "author": {
                  "@type": "Person",
                  "name": r.name
                },
                "reviewBody": r.text
              }))
            })}
          </script>
        </div>
      </div>
    </section>
  );
};