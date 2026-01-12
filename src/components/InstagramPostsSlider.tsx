"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InstagramPost } from '@/types/instagram';

interface InstagramPostsSliderProps {
  posts: InstagramPost[];
  loading?: boolean;
  error?: string | null;
}

// Helper function to format number (1234 → 1.2K)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

// Helper function to truncate caption
const truncateCaption = (caption: string, maxLength: number = 80): string => {
  if (!caption) return '';
  const cleaned = caption.replace(/\n/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + '...';
};

// Helper function to extract tag from caption
const extractTag = (caption: string): string => {
  if (!caption) return 'POST';
  const lowerCaption = caption.toLowerCase();
  if (lowerCaption.includes('reel')) return 'REEL';
  if (lowerCaption.includes('video')) return 'VIDEO';
  if (lowerCaption.includes('event')) return 'EVENT';
  if (lowerCaption.includes('announcement')) return 'NEWS';
  return 'POST';
};

export function InstagramPostsSlider({ posts, loading = false, error = null }: InstagramPostsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const totalSlides = posts.length;
  const visibleSlides = typeof window !== 'undefined' 
    ? (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    : 3;

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    if (!sliderRef.current || totalSlides === 0) return;
    
    const maxIndex = Math.max(0, totalSlides - visibleSlides);
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(newIndex);
    
    const slideWidth = sliderRef.current.scrollWidth / totalSlides;
    sliderRef.current.scrollTo({
      left: slideWidth * newIndex,
      behavior: 'smooth'
    });
  }, [totalSlides, visibleSlides]);

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    const maxIndex = Math.max(0, totalSlides - visibleSlides);
    const newIndex = activeIndex >= maxIndex ? 0 : activeIndex + 1;
    goToSlide(newIndex);
  }, [activeIndex, goToSlide, totalSlides, visibleSlides]);

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    const maxIndex = Math.max(0, totalSlides - visibleSlides);
    const newIndex = activeIndex <= 0 ? maxIndex : activeIndex - 1;
    goToSlide(newIndex);
  }, [activeIndex, goToSlide, totalSlides, visibleSlides]);

  // Auto-play functionality
  useEffect(() => {
    if (posts.length === 0 || isHovered || isDragging) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [posts.length, isHovered, isDragging, nextSlide]);

  // Handle scroll sync for active indicator
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const slideWidth = slider.scrollWidth / totalSlides;
      const newIndex = Math.round(slider.scrollLeft / slideWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [totalSlides, activeIndex]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.pageX;
    scrollStartX.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (dragStartX.current - x) * 1.5;
    sliderRef.current.scrollLeft = scrollStartX.current + walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    dragStartX.current = e.touches[0].pageX;
    scrollStartX.current = sliderRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (dragStartX.current - x) * 1.2;
    sliderRef.current.scrollLeft = scrollStartX.current + walk;
  };

  // Loading state
  if (loading) {
    return (
      <div className="ig-slider">
        <div className="ig-slider__loading">
          <div className="ig-slider__spinner"></div>
          <p>Loading Instagram posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="ig-slider">
        <div className="ig-slider__error">
          <i className="fas fa-exclamation-circle"></i>
          <p>Error loading posts</p>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="ig-slider">
        <div className="ig-slider__empty">
          <i className="fab fa-instagram"></i>
          <p>No posts available</p>
          <span>Check back soon for updates!</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="ig-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Navigation Arrows */}
      <button 
        className="ig-slider__nav ig-slider__nav--prev"
        onClick={prevSlide}
        aria-label="Previous posts"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <button 
        className="ig-slider__nav ig-slider__nav--next"
        onClick={nextSlide}
        aria-label="Next posts"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Slider Track */}
      <div 
        className={`ig-slider__track ${isDragging ? 'is-dragging' : ''}`}
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {posts.map((post, index) => (
          <article key={post.id} className="ig-slider__card">
            {/* Card Header */}
            <div className="ig-slider__card-header">
              <div className="ig-slider__avatar">
                <img 
                  src="/assets/images/resources/logo-11.png" 
                  alt={post.username}
                  loading="lazy"
                />
              </div>
              <div className="ig-slider__user-info">
                <h4 className="ig-slider__username">{post.username}</h4>
                <span className="ig-slider__date">{formatDate(post.timestamp)}</span>
              </div>
              <span className="ig-slider__tag">{extractTag(post.caption)}</span>
            </div>

            {/* Card Image */}
            <a 
              href={post.postUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ig-slider__image-link"
              onClick={(e) => isDragging && e.preventDefault()}
            >
              <div className="ig-slider__image-wrapper">
                <img 
                  src={post.imageUrl || '/assets/images/blog/blog-1-1.jpg'} 
                  alt={truncateCaption(post.caption, 50) || 'Instagram post'}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/blog/blog-1-1.jpg';
                  }}
                />
                <div className="ig-slider__image-overlay">
                  <i className="fab fa-instagram"></i>
                  <span>View on Instagram</span>
                </div>
              </div>
            </a>

            {/* Card Actions */}
            <div className="ig-slider__actions">
              <div className="ig-slider__action-buttons">
                <button className="ig-slider__action-btn" aria-label="Like">
                  <i className="far fa-heart"></i>
                </button>
                <button className="ig-slider__action-btn" aria-label="Comment">
                  <i className="far fa-comment"></i>
                </button>
                <button className="ig-slider__action-btn" aria-label="Share">
                  <i className="far fa-paper-plane"></i>
                </button>
              </div>
              <button className="ig-slider__action-btn" aria-label="Save">
                <i className="far fa-bookmark"></i>
              </button>
            </div>

            {/* Card Content */}
            <div className="ig-slider__content">
              <p className="ig-slider__likes">
                {post.likes > 0 ? `${formatNumber(post.likes)} likes` : ''}
              </p>
              <p className="ig-slider__caption">
                <strong>{post.username}</strong> {truncateCaption(post.caption)}
              </p>
              <a 
                href={post.postUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ig-slider__view-link"
                onClick={(e) => isDragging && e.preventDefault()}
              >
                {post.comments && post.comments > 0 
                  ? `View all ${formatNumber(post.comments)} comments` 
                  : 'View on Instagram'}
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Dot Indicators */}
      {totalSlides > visibleSlides && (
        <div className="ig-slider__dots">
          {Array.from({ length: Math.ceil(totalSlides - visibleSlides + 1) }).map((_, index) => (
            <button
              key={index}
              className={`ig-slider__dot ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="ig-slider__progress">
        <div 
          className="ig-slider__progress-bar"
          style={{ 
            width: `${((activeIndex + 1) / Math.max(1, totalSlides - visibleSlides + 1)) * 100}%` 
          }}
        />
      </div>
    </div>
  );
}

