'use client';
import { useT } from 'next-i18next/client';
import PostsFeed from '@/widgets/PostsFeed';
import CreatePost from '@/features/CreatePost';
import { useAuth } from '@/entities/auth/useAuth';
import './style.css';

function HomePage() {
  const { t } = useT(['homePage', 'common']);
  const { currentUser } = useAuth();

  return (
    <div className='home-page-container'>
      <h1 className='visually-hidden'>{t(($) => $.title)}</h1>
      <section className='home-page-content'>
        <h2 className='visually-hidden'>{t(($) => $.postsFeedTitle)}</h2>
        {currentUser &&
          <CreatePost currentUser={currentUser} />
        }
        <PostsFeed />
      </section>

      {currentUser &&
        <aside className='home-page-suggested'>
          <h2 className='visually-hidden'>{t(($) => $.suggestions.title)}</h2>
        </aside>
      }
    </div>
  );
}

export default HomePage;
