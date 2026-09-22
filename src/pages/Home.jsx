import { useEffect, useState } from 'react';
import { getArticles, getFileUrl } from '../services/pb';
import SecondaryButton from '../components/SecondaryButton';
import PrimaryButton from '../components/PrimaryButton';
import Modal from '../components/Modal';
import Bot from '../components/Bot';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@carbon/icons-react';
import mbHero from '../assets/mb_hero.webp';

export default function Home() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    getArticles()
      .then((data) => {
        console.log('PocketBase records:', data);
        setArticles(data);
      })
      .catch((error) => {
        console.error('PocketBase error:', error);
      });
  }, []);

  // useEffect(() => {
  //   sendMessage('Wie alt bist du?');
  // }, []);

  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden bg-background-elevated px-6 md:px-8 py-16 min-[980px]:py-16 flex items-center justify-center min-h-[460px] min-[980px]:min-h-[560px]">
        <div className="flex flex-col min-[980px]:flex-row items-start min-[980px]:items-center justify-between max-w-[1000px] w-full gap-8 relative">
          <div className="w-full max-w-[540px] flex flex-col gap-10 py-4 z-10">
            <h1 className="text-display font-bold">Hi, I'm Maik!</h1>
            <p className="text-h3 leading-body font-normal">
              A UX designer and Media Informatics master’s student focused on conception and prototyping over pure visual styling. Specializing in design systems, flawless design-to-development handoffs, and speaking code just as fluently as Figma.
            </p>
            <div className="flex flex-wrap gap-4">
              <PrimaryButton
                label="More About Me"
                onClick={() => navigate('/about')}
                className="w-fit"
              />
              <SecondaryButton
                label="Chat With My Ai Bot"
                onClick={() => setIsChatOpen(true)}
                className="w-fit"
              />
            </div>
          </div>

          <div className="hidden min-[980px]:flex absolute -right-32 lg:-right-40 top-1/2 -translate-y-[40%] w-[640px] lg:w-[720px] justify-center items-center pointer-events-none select-none">
            <img
              src={mbHero}
              alt="Maik Bartels"
              className="w-full h-auto object-contain scale-125 lg:scale-135 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center bg-background-default px-8 py-[100px]">
        <div className="flex flex-col gap-16 max-w-[1000px] flex-1">
          <h2 className="text-h1 font-semibold ">Selected Works</h2>
          {articles.map((article) => (
            <div key={article.id} className="flex flex-col gap-4">
              {article.thumbnail && (
                <img
                  src={getFileUrl(article, article.thumbnail)}
                  alt={article.title || 'Thumbnail'}
                />
              )}
              <p className='font-normal uppercase text-text-subtle text-small tracking-[2px]'>{article.tag}</p>
              <h2 className="text-h3 font-semibold">{article.title}</h2>
              <SecondaryButton
                label="View Case Study"
                onClick={() => navigate(`/case-study/${article.id}`)}
                className='w-fit'
                icon={<ArrowRight size="20" />}
              />
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        containerClassName="w-full max-w-[680px] mx-4"
      >
        <Bot onClose={() => setIsChatOpen(false)} />
      </Modal>
    </main>
  );
}
