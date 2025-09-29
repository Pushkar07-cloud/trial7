import React from 'react';
import { Star, Quote } from 'lucide-react';
import AgriculturalIcons from '@/components/AgriculturalIcons';
import farmerTestimonial1 from '@/assets/farmer-testimonial-1.jpg';
import farmerTestimonial2 from '@/assets/farmer-testimonial-2.jpg';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Rice Farmer, Punjab',
      location: 'Punjab, India',
      rating: 5,
      content: 'Krishi Mitra has transformed my farming completely. The soil analysis helped me increase my rice yield by 35% while reducing fertilizer costs by 20%. The AI recommendations are incredibly accurate and easy to understand!',
      image: farmerTestimonial1
    },
    {
      name: 'Priya Sharma',
      role: 'Organic Farm Owner, Gujarat',
      location: 'Gujarat, India',
      rating: 5,
      content: 'The pest alert system saved my entire organic crop last season. I received early warnings about potential threats and took preventive measures. This platform is a game-changer for sustainable farming in India.',
      image: farmerTestimonial2
    },
    {
      name: 'Arjun Patel',
      role: 'Vegetable Farmer, Maharashtra',
      location: 'Maharashtra, India',
      rating: 5,
      content: 'Using Krishi Mitra for the past year has been amazing. The crop monitoring feature helps me track growth patterns and optimize irrigation. My profits have increased by 40% and I can now plan better for each season.',
      image: farmerTestimonial1
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            🌾 What Indian Farmers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real stories from farmers across India who have transformed their agricultural practices with Krishi Mitra.
          </p>
          
          {/* Agricultural Icons */}
          <div className="flex justify-center gap-6 mt-8">
            <AgriculturalIcons type="nature" size="lg" />
            <AgriculturalIcons type="crops" size="lg" />
            <AgriculturalIcons type="growth" size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-100 h-full">
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Quote className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 leading-relaxed mb-8 text-center text-lg">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-bold text-xl text-gray-800 mb-1">
                    {testimonial.name}
                  </div>
                  <div className="text-green-600 font-semibold mb-1">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Join 5000+ Indian Farmers Using Krishi Mitra
            </h3>
            <p className="text-lg opacity-90">
              Start your journey towards smarter, more profitable farming today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};