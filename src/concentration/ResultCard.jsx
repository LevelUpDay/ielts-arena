import { useNavigate } from 'react-router-dom';

export default function ResultCard({ title, lines, upd, onRetry }) {
  const navigate = useNavigate();
  return (
    <div className="card p-5">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <div className="mb-3 flex flex-col gap-1 text-sm">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      {upd && (
        <p className="mb-4 text-sm">
          Reyting: {upd.before} → <b>{upd.after}</b>{' '}
          <span className={upd.delta >= 0 ? 'text-emerald-500' : 'text-red-500'}>
            ({upd.delta >= 0 ? '+' : ''}{upd.delta})
          </span>
        </p>
      )}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={onRetry}>Qayta urinish</button>
        <button className="btn-outline" onClick={() => navigate('/concentration')}>Bo'lim sahifasi</button>
      </div>
    </div>
  );
}
