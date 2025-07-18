import React from 'react';
import Card from '../ui/Card';
import '../../styles/components/sections/FeaturesSection.css';

const FeatureCard = ({ title, imageUrl, features }) => (
  <Card variant="feature">
    <h2 className="feature-title">{title}</h2>
    <div 
      className="feature-image" 
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
    <ul className="feature-list">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </Card>
);

const FeaturesSection = () => {
  const features = [
    {
      title: "WHY STUDENTS LOVE EDUBRIDGE",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Affordable access to textbooks",
        "Buy, sell, or donate in a few clicks",
        "Track your learning progress"
      ]
    },
    {
      title: "HOW IT WORKS",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      features: [
        "Buy digital textbooks at student-friendly prices",
        "List your old books and earn money",
        "Track everything in your dashboard",
        "Join study groups and discussions"
      ]
    }
  ];

  return (
    <section className="features-section">
      {features.map((feature, index) => (
        <FeatureCard 
          key={index}
          title={feature.title}
          imageUrl={feature.imageUrl}
          features={feature.features}
        />
      ))}
    </section>
  );
};

export default FeaturesSection;