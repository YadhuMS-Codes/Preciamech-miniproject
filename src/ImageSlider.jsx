
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ImageSlider() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get images from the Preciamechpics folder
    const imageCount = 20; // Assuming you have 20 images
    const imageList = [];
    
    for (let i = 1; i <= imageCount; i++) {
      if (i <= 20) { // Only include images that exist
        imageList.push(`/Preciamechpics/${i}.jpg`);
      }
    }
    
    setImages(imageList);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div className="gallery-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`} 
              className="gallery-image"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ImageSlider() {
  // Array of images from the Preciamechpics folder
  const images = Array.from({ length: 20 }, (_, i) => `/Preciamechpics/${i + 1}.jpg`);

  return (
    <div className="gallery-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`}
              className="gallery-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Found";
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
