import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import heroFarmerTech from '@/assets/hero-farmer-tech.jpg';
import heroFields from '@/assets/hero-fields.jpg';
import heroResearch from '@/assets/hero-research.jpg';

export const BlogSection = () => {
  const blogPosts = [
    {
      image: heroFarmerTech,
      title: '5 Essential Tips for Smart Farming in 2024',
      excerpt: 'Discover the latest techniques and technologies that are revolutionizing modern agriculture.',
      date: 'March 15, 2024',
      readTime: '5 min read'
    },
    {
      image: heroFields,
      title: 'Understanding Soil Health Through AI Analysis',
      excerpt: 'Learn how artificial intelligence can help you make informed decisions about soil management.',
      date: 'March 12, 2024',
      readTime: '7 min read'
    },
    {
      image: heroResearch,
      title: 'Sustainable Farming Practices for Better Yields',
      excerpt: 'Explore eco-friendly farming methods that increase productivity while protecting the environment.',
      date: 'March 8, 2024',
      readTime: '6 min read'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Knowledge Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest farming insights, tips, and agricultural innovations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-card rounded-2xl overflow-hidden shadow-agri-card hover:shadow-agri-hero transition-all duration-300 hover:scale-105 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-agri-green transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Button variant="ghost" className="p-0 h-auto text-agri-green hover:text-agri-green-dark">
                  Read More
                  <ArrowRight size={16} />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};