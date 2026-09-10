import { FiExternalLink, FiInfo } from 'react-icons/fi'

const TYPE_META = {
  official: { label: 'Officiel', className: 'bg-blue-50 text-blue-800 border-blue-200' },
  live: { label: 'Temps réel', className: 'bg-green-50 text-green-800 border-green-200' },
  static: { label: 'Statique', className: 'bg-stone-100 text-stone-700 border-stone-200' },
  estimated: { label: 'Estimé', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  simulated: { label: 'Simulé', className: 'bg-purple-50 text-purple-800 border-purple-200' }
};

function isRealUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function resolveProvenance(catalog, scope) {
  if (!catalog || !scope) return null;
  if (catalog.type || catalog.kind || catalog.mode) return catalog;

  const containers = [catalog, catalog.data, catalog.domains, catalog.services, catalog.provenance]
    .filter(Boolean);
  for (const container of containers) {
    if (container[scope]) return container[scope];
  }

  const entries = catalog.sources || catalog.items || catalog.entries;
  if (Array.isArray(entries)) {
    return entries.find(entry => entry.id === scope || entry.key === scope || entry.scope === scope) || null;
  }
  return null;
}

function availabilityLabel(value) {
  if (value === true || value === 'available') return 'Disponible';
  if (value === false || value === 'unavailable') return 'Indisponible';
  if (value === 'conditional' || value === 'degraded') return 'Disponibilité conditionnelle';
  return typeof value === 'string' && value ? value : null;
}

function ProvenanceNotice({ provenance, fallback = null, scope, title, className = '' }) {
  const record = resolveProvenance(provenance, scope) || fallback;
  if (!record) return null;

  const rawType = String(record.type || record.kind || record.mode || 'static').toLowerCase();
  const type = TYPE_META[rawType] ? rawType : 'static';
  const meta = TYPE_META[type];
  const availability = availabilityLabel(record.available ?? record.availability ?? record.status);
  const sourceRecord = record.source && typeof record.source === 'object' ? record.source : null;
  const source = record.source_name || sourceRecord?.organization || sourceRecord?.name || record.source || record.provider || record.name;
  const url = record.source_url || sourceRecord?.url || record.url || record.link;
  const detail = record.note || record.description || record.details || record.limitations?.join(' ');

  return (
    <div className={`rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-600 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <FiInfo className="text-stone-400 flex-shrink-0" size={13} aria-hidden="true" />
        {title && <span className="font-semibold text-stone-800">{title}</span>}
        <span className={`inline-flex rounded-full border px-2 py-0.5 font-semibold ${meta.className}`}>
          {meta.label}
        </span>
        {availability && <span className="text-stone-500">{availability}</span>}
        {source && <span className="text-stone-500">Source : {typeof source === 'string' ? source : source.name}</span>}
        {isRealUrl(url) && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-amber-800 hover:underline">
            Consulter <FiExternalLink size={11} aria-hidden="true" />
          </a>
        )}
      </div>
      {detail && <p className="mt-1.5 leading-relaxed text-stone-500">{detail}</p>}
    </div>
  );
}

export default ProvenanceNotice
