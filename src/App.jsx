import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Listings from './components/Listings';
import ToolsShowcase from './components/ToolsShowcase';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  const accent = '#00D4C8';

  return (
    <div style={{ position: 'relative', width: '100%', background: '#F4F1EC' }}>
      <Header />
      <main>
        <Hero accent={accent} />
        <HowItWorks accent={accent} />
        <Listings accent={accent} />
        <ToolsShowcase accent={accent} />
        <FAQ />
      </main>
      <Footer accent={accent} />
      <Analytics />
    </div>
  );
}
