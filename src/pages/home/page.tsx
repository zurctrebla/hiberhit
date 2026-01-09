import { useState } from 'react';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import ProductsSection from './components/ProductsSection';
import HowItWorksSection from './components/HowItWorksSection';
import AuthoritySection from './components/AuthoritySection';
import IconicProjectsSection from './components/IconicProjectsSection';
import QuoteFormSection from './components/QuoteFormSection';
import FinalCTASection from './components/FinalCTASection';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import WhatsAppButton from '../../components/feature/WhatsAppButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <ProductsSection />
      <HowItWorksSection />
      <AuthoritySection />
      <IconicProjectsSection />
      <FinalCTASection />
      <QuoteFormSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}