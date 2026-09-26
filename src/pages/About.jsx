import { useState } from 'react';
import pic1 from '../assets/pic1.webp';
import pic2 from '../assets/pic2.webp';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { getFile, getFileUrl } from '../services/pb';

export default function About() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadResume = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const record = await getFile('d8gnn2jgps5lbqw');
      const fileUrl = getFileUrl(record, record.file, { download: '1' });
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Fehler beim Herunterladen des Resumes:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <main className="flex flex-col">
      <section className="flex items-center justify-center bg-background-default px-8 py-[100px]">
        <div className="max-w-[1000px] w-full flex flex-col md:flex-row gap-12 items-stretch">

          {/* Linke Spalte: Feste Breite, Höhe passt sich automatisch über flex items-stretch an */}
          <div className="flex flex-col gap-4 w-full md:w-[280px] shrink-0">
            <div className="flex-1 min-h-0 overflow-hidden">
              <img
                src={pic2}
                alt="Maik Bartels"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <img
                src={pic1}
                alt="Maik Bartels"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Rechte Spalte: KPIs, Fließtext & Buttons */}
          <div className="flex flex-col justify-between gap-10 flex-1 min-w-0">

            {/* KPI Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
              <div className="border-2 border-background-elevated px-4 py-6 flex flex-col items-center justify-center text-center">
                <span className="text-h2 font-bold text-headline-default">M.Sc.</span>
                <span className="text-text-subtle text-small mt-1">Media Informatics</span>
              </div>
              <div className="border-2 border-background-elevated px-4 py-6 flex flex-col items-center justify-center text-center">
                <span className="text-h2 font-bold text-headline-default">3+</span>
                <span className="text-text-subtle text-small mt-1">Years Experience</span>
              </div>
              <div className="border-2 border-background-elevated px-4 py-6 flex flex-col items-center justify-center text-center">
                <span className="text-h2 font-bold text-headline-default">UX & Code</span>
                <span className="text-text-subtle text-small mt-1">Focus</span>
              </div>
            </div>

            {/* 3 Textabsätze */}
            <div className="flex flex-col gap-4 text-text-default text-body leading-relaxed">
              <p>
                Hi everyone, I was born and raised in the southern part of Hamburg, where I still live today. From an early age, I had two main interests: sports and technology. At first, it was just little projects and, above all, lots of video games, but eventually I was drawn to programming.
              </p>
              <p>
                After graduating from high school and spending a year in the Navy, I went to Lübeck to study. I planned to major in Media Informatics. Today, I’m in the middle of my master’s program and have been working as a UX designer for over three years. Throughout this time, I’ve already worked on many projects. I’ve always found it particularly exciting when design meets technology. In addition to designing complex interfaces, I’ve especially enjoyed working on design systems and accessibility. The systematic approach and the discipline of thinking holistically.
              </p>
              <p>
                In my leisure time, I pursue my other interest: sports. Personally, I love playing soccer, going to the gym, or running. I also enjoy immersing myself in the world of sports while watching TV, from soccer or NFL to Formula 1, I cover it all. Otherwise, I tinker with my own projects using React, explore new technologies, expand my smart home setup in Home Assistant, or sit down with my PlayStation.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <PrimaryButton
                label="LinkedIn"
                onClick={() => window.open('https://www.linkedin.com/in/maik-bartels-ab9a8721a', '_blank')}
              />
              <SecondaryButton
                label='Resume'
                onClick={handleDownloadResume}
                disabled={isDownloading}
              />
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
