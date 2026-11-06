import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ lng: 'en' })),
  usePathname: vi.fn(() => '/en'),
  useRouter: vi.fn(),
}));
