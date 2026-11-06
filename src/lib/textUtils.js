// Shared small text helpers used by exercise engines.

export function R(a) { return a[Math.floor(Math.random() * a.length)]; }

export function shuf(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const US = {
  favorite: 'favourite', favorites: 'favourites', color: 'colour', colors: 'colours',
  organize: 'organise', organized: 'organised', center: 'centre', theater: 'theatre',
  behavior: 'behaviour', neighbor: 'neighbour', gray: 'grey', realize: 'realise',
  recognize: 'recognise', analyze: 'analyse', traveling: 'travelling', defense: 'defence',
  honor: 'honour', labor: 'labour', catalog: 'catalogue',
};
export function uk(x) {
  return String(x).replace(/[A-Za-z]+/g, (w) => US[w.toLowerCase()] || w);
}

export function norm(s) {
  return String(s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/£/g, '')
    .replace(/:/g, '.').replace(/\s+/g, '').replace(/\.$/, '');
}

export function words(s) {
  return String(s || '').toLowerCase().replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ').split(/\s+/).filter(Boolean);
}

// Flexible short-answer checker: exact match, numeric-only match, or "contains as a word" match.
export function chk(ans, arr) {
  ans = uk(ans);
  if (arr.map(norm).includes(norm(ans))) return true;
  const k = norm(arr[0]);
  if (/^[0-9.]+$/.test(k)) {
    const nm = ans.toLowerCase().replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || [];
    return nm.length === 1 && arr.map(norm).includes(nm[0]);
  }
  const low = ans.toLowerCase();
  return arr.some((x) => {
    const esc = x.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9-])${esc}($|[^a-z0-9-])`).test(low);
  });
}
