import { EmptyState } from '../components/ui';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/notfound';

export function NotFoundPage() {
  const { lang } = useLang();
  const L = STR[lang];
  return (
    <div>
      <h1 className="sr-only">{L.title}</h1>
      <EmptyState icon="search" title={L.title} body={L.body} actionLabel={L.home} actionTo="/" />
    </div>
  );
}
