'use client'
import { useState } from "react";
import React from "react";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

interface ImageSliderProps {
  images?: string[];
  content?: any;
}

export default function ImageSlider({  content }: ImageSliderProps) {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <>

      <div className="overflow-hidden">
        <Slider {...settings}>
          {content}
        </Slider>
      </div>
    </>
  )
}
