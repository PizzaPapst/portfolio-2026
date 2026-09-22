import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { DocumentPdf, LogoFigma, Image, Document } from '@carbon/icons-react';
import Carousel from '../components/Carousel';
import Link from '../components/Link';
import { getArticleBlocks, getFileUrl } from '../services/pb';

function formatFileName(filename) {
  if (!filename) return '';
  // Entfernt PocketBase-Zufallshashes wie _42bcdlz99c vor der Dateiendung
  return filename.replace(/_[a-zA-Z0-9]{10}(\.[a-zA-Z0-9]+)$/, '$1');
}

function getFileIcon(filename) {
  if (!filename) return <Document size={24} />;
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return <DocumentPdf size={24} />;
  }
  if (ext === 'fig') {
    return <LogoFigma size={24} />;
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'avif'].includes(ext)) {
    return <Image size={24} />;
  }
  return <Document size={24} />;
}

export default function CaseStudyDetail() {
  const { id } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticleBlocks(id).then((data) => {
      setBlocks(data);
      setArticle(data[0].expand.article);
    });
  }, [id]);

  const attachments = Array.isArray(article?.attachments)
    ? article.attachments
    : article?.attachments
      ? [article.attachments]
      : [];

  const markdownOptions = {
    wrapper: 'div',
    overrides: {
      h1: { props: { className: 'text-h1 leading-h1 font-bold text-headline-default mt-8 mb-4 max-w-[800px] w-full' } },
      h2: { props: { className: 'text-h2 leading-h2 font-semibold text-headline-default mt-4 mb-1 max-w-[800px] w-full' } },
      h3: { props: { className: 'text-h3 leading-h3 font-semibold text-headline-default mt-4 mb-2 max-w-[800px] w-full' } },
      h4: { props: { className: 'text-h4 leading-h4 font-semibold text-headline-default mt-4 mb-2 max-w-[800px] w-full' } },
      p: { props: { className: 'text-body leading-body text-text-default mb-4 max-w-[800px] w-full' } },
      ul: { props: { className: 'list-disc list-outside pl-6 space-y-1 mb-4 text-text-default max-w-[800px] w-full' } },
      ol: { props: { className: 'list-decimal list-outside pl-6 space-y-1 mb-4 text-text-default max-w-[800px] w-full' } },
      li: { props: { className: 'text-body leading-body max-w-[800px]' } },
      a: { props: { className: 'text-primary underline hover:opacity-80' } },
    },
  };

  return (
    <main className="flex flex-col">
      <div className="flex items-center justify-center bg-background-default px-8 py-[100px]">
        <div className="flex flex-col items-center max-w-[1000px] flex-1">
          {article && <div className='flex flex-col gap-8 w-full pb-[64px] max-w-[800px]'>
            <p className='font-normal uppercase text-text-subtle text-small tracking-[2px]'>{article.tag}</p>
            <h1 className="text-h1 font-semibold leading-h1">{article.title}</h1>
            <p className="text-h3 font-normal text-text-subtle leading-body">{article.subtitle}</p>
            {article.thumbnail && (
              <img
                src={getFileUrl(article, article.thumbnail)}
                alt={article.title || 'Thumbnail'}
              />
            )}
            <div className='flex gap-2 w-full items-center text-text-subtle text-small font-light leading-small'>
              <p>{new Date(article.date).toLocaleDateString()}</p>
              <div className='w-1 h-1 rounded-full bg-text-subtle' aria-hidden />
              <p>{article.readingTime} min.</p>
            </div>
          </div>}

          {blocks && blocks.length > 0 ? (
            blocks.map((block) => (
              <article key={block.id} className="flex flex-col items-center w-full">
                {block.text_content && (
                  <Markdown options={markdownOptions} className="flex flex-col items-center w-full">
                    {block.text_content}
                  </Markdown>
                )}

                {/* Falls der Block Bilder in gallery_images hat */}
                {Array.isArray(block.gallery_images) && block.gallery_images.length > 0 && (
                  <div className="w-full mt-8 mb-12">
                    <Carousel
                      images={block.gallery_images.map((imgName) => getFileUrl(block, imgName))}
                      altTexts={block.alt_texts}
                      labels={block.labe_texts || block.label_texts || block.labels || block.label}
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="text-text-subtle">Lade Inhalte...</p>
          )}

          {/* Resources / Attachments Bereich */}
          {attachments.length > 0 && (
            <section className="w-full max-w-[800px] flex flex-col gap-6">
              <h2 className="text-h2 font-semibold text-headline-default">
                Resources
              </h2>

              <div className="flex flex-col items-start gap-4">
                {attachments.map((filename) => {
                  const fileUrl = getFileUrl(article, filename, { download: '1' });
                  const displayName = formatFileName(filename);
                  const icon = getFileIcon(filename);

                  return (
                    <Link
                      key={filename}
                      href={fileUrl}
                      download={displayName}
                      icon={icon}
                      className="text-h4 font-normal text-text-default hover:text-headline-default"
                    >
                      {displayName}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
