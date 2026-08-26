import { Link } from 'react-router-dom';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { Icon, IconTile, type IconName } from '../components/Icon';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/trainerhub';
import { STR as PRO_STR } from '../i18n/pages/pro';
import { usePro } from '../lib/pro/ProProvider';
import { isFreeTrainer } from '../lib/pro/plan';

const TRAINERS: Array<{ id: 'szenario' | 'preflop' | 'potodds' | 'equity' | 'handranking' | 'outs' | 'pushfold'; to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet' }> = [
  { id: 'szenario', to: '/lernen/trainer/szenario', icon: 'scene', tone: 'gold' },
  { id: 'preflop', to: '/lernen/trainer/preflop', icon: 'grid', tone: 'green' },
  { id: 'potodds', to: '/lernen/trainer/potodds', icon: 'scale', tone: 'blue' },
  { id: 'equity', to: '/lernen/trainer/equity', icon: 'chart', tone: 'violet' },
  { id: 'handranking', to: '/lernen/trainer/handranking', icon: 'play', tone: 'red' },
  { id: 'outs', to: '/lernen/trainer/outs', icon: 'eye', tone: 'blue' },
  { id: 'pushfold', to: '/lernen/trainer/pushfold', icon: 'push', tone: 'gold' },
];

export function TrainerHub() {
  const { data } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO_STR[lang];
  const { fullAccess } = usePro();
  const unlocked = fullAccess;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dailyDone = data.daily?.date === todayStr;

  return (
    <div>
      <BackLink to="/lernen" label={NAV[lang].navLearn} />
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <Link to="/lernen/tagesquiz" className="card clickable" style={{ display: 'block', marginBottom: 16, borderColor: 'rgba(212,175,94,0.35)' }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <IconTile name="sun" tone="gold" />
          <div style={{ flex: 1 }}>
            <div className="row between wrap">
              <div style={{ fontWeight: 800, fontSize: 17 }}>{L.dailyQuiz}</div>
              {dailyDone ? (
                <span className="pill ok">{L.dailyDone(data.daily?.score ?? 0, data.daily?.total ?? 0)}</span>
              ) : (
                <span className="pill gold">{L.dailyBonus}</span>
              )}
            </div>
            <div className="small muted" style={{ marginTop: 3 }}>
              {L.dailyDesc}
            </div>
          </div>
        </div>
      </Link>

      <div className="grid cols-2">
        {TRAINERS.map((t) => {
          const stats = data.trainers[t.id];
          const acc = stats && stats.attempts > 0 ? Math.round((100 * stats.correct) / stats.attempts) : null;
          const info = L.trainers[t.id];
          // Gesperrte Trainer bleiben anklickbar – die Zielseite erklärt, was dahinter steckt.
          const locked = !unlocked && !isFreeTrainer(t.id);
          return (
            <Link key={t.id} to={t.to} className="card clickable">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <IconTile name={t.icon} tone={t.tone} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16.5 }}>
                    {info.title}
                    {locked && (
                      <span className="pill gold" style={{ marginLeft: 8, verticalAlign: 'middle', fontWeight: 700 }}>
                        <Icon name="lock" size={14} />
                        {P.proBadge}
                      </span>
                    )}
                  </div>
                  <div className="small muted" style={{ marginTop: 3 }}>
                    {info.desc}
                  </div>
                  <div className="row wrap" style={{ marginTop: 12 }}>
                    {acc !== null ? (
                      <>
                        <span className="pill">{L.attempts(stats!.attempts)}</span>
                        <span className={`pill ${acc >= 70 ? 'ok' : ''}`}>{L.accuracy(acc)}</span>
                        <span className="pill gold">{L.bestStreak(stats!.bestStreak)}</span>
                      </>
                    ) : (
                      <span className="pill">{L.notStarted}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
