/* ===== Dio si Agen Data (purwarupa skripsi) =====
   PENGATURAN SUPABASE: isi dengan URL proyek dan kunci PUBLISHABLE (bukan secret key).
   Kosongkan/biarkan teks bawaan bila ingin menyimpan log lokal saja (tautan "unduh log").
   Kolom tabel interaction_logs: session_id, mission_id, timestamp_rel, event_type, program_snapshot, execution_result. */
const SUPABASE_URL = 'https://qxlhlwarmfgvkzibebcp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_E0CVVaHU7KRffuseLtQ-lg_rSPpFUMj';
const sb = (SUPABASE_URL.startsWith('https://') && window.supabase) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

/* ---------- Misi ---------- */
// j: jenis dokumen (foto/tugas). r: dokumen rahasia. s: sudah digembok.
const dok = (j, r) => ({ j, r: !!r }), tugas = () => dok('tugas'), foto = () => dok('foto'), rahasia = () => dok('tugas', true);
const START = { blocks: { languageVersion: 0, blocks: [{ type: 'mulai', deletable: false, movable: false, x: 20, y: 20 }] } };

const LV = [
  {
    id: 'L1',
    nomor: 1,
    nama: '1 Urutan 🚶',
    judul: 'Langkah Pertama Dio',
    items: [tugas()],
    tools: ['ambil', 'kirim'],
    cerita: 'Dio si Agen Data punya tugas pertama! Bantu Dio mengambil dan mengirimkan lembar <b>tugas 📄</b> ke temannya.',
    tantangan: 'Ambil berkas tugas di ban berjalan, lalu kirimkan!',
    misi: 'Dio harus mengirim satu tugas ke temannya. Ambil dulu tugasnya, lalu kirim ya!'
  },
  {
    id: 'L2',
    nomor: 2,
    nama: '2 Ulangi 🔁',
    judul: 'Tugas Menumpuk!',
    items: [tugas(), tugas(), tugas(), tugas(), tugas()],
    max: 3,
    tools: ['ambil', 'kirim', 'ulangi'],
    cerita: 'Ada <b>5 tugas 📄</b> di ban berjalan! Kirim semuanya sampai bersih ya. Tapi balok programmu dibatasi!',
    tantangan: 'Kirim semua 5 tugas sampai ban berjalan kosong!',
    aturanKhusus: '💡 <b>Tantangan Balok:</b> Gunakan maksimal <b>3 balok</b> saja (di luar balok Mulai). Manfaatkan balok <b>🔁 ulangi</b>!',
    misi: 'Ada 5 tugas di ban berjalan. Kirim semuanya! Tapi balokmu cuma boleh 3 ya (balok "Mulai" tidak dihitung).'
  },
  {
    id: 'L3',
    nomor: 3,
    nama: '3 Jika 🤔',
    judul: 'Memilah Berkas',
    items: [foto(), tugas(), foto(), tugas(), tugas()],
    tools: ['ambil', 'simpan_album', 'simpan_tugas', 'ulangi', 'jika_jenis'],
    cerita: 'Berkasnya campur aduk: ada <b>foto 📷</b> dan ada <b>tugas 📄</b>. Jangan sampai salah memasukkan tempat ya!',
    tantangan: 'Pilah berkas: <b>Foto 📷</b> masukkan ke <b>Album</b>, dan <b>Tugas 📄</b> masukkan ke <b>folder Tugas</b>.',
    misi: 'Berkasnya campur aduk: ada foto 📷 dan tugas 📄. Foto masuk Album, tugas masuk folder Tugas. Dio bisa mengintip dulu jenis berkasnya.'
  },
  {
    id: 'L4',
    nomor: 4,
    nama: '4 Gembok 🔒',
    judul: 'Lindungi Data Rahasia',
    items: [tugas(), rahasia(), tugas(), rahasia()],
    tools: ['ambil', 'kirim', 'beri_sandi', 'ulangi', 'jika_rahasia'],
    cerita: 'Awas! Ada dokumen biasa 📄 dan ada <b>dokumen rahasia 📕</b> (nilai ujian siswa). Berkas rahasia harus aman!',
    tantangan: 'Kirim semua berkas! Dokumen biasa bisa langsung dikirim, tapi dokumen rahasia <b>wajib digembok 🔒</b> dulu.',
    aturanKhusus: '🔒 <b>Aturan Keamanan:</b> Dokumen rahasia yang terkirim tanpa digembok akan gagal karena bocor! 😱',
    misi: 'Ada dokumen biasa 📄 dan dokumen rahasia 📕 (nilai ujian). Dokumen rahasia harus digembok 🔒 dulu sebelum dikirim, supaya orang lain tidak bisa membacanya.'
  },
  {
    id: 'L5',
    nomor: 5,
    nama: '5 Perbaiki 🔧',
    judul: 'Detektif Kode (Debug)',
    items: [foto(), tugas(), tugas(), foto()],
    tools: ['ambil', 'simpan_album', 'simpan_tugas', 'ulangi', 'jika_jenis'],
    cerita: 'Program buatan temanmu macet di tengah jalan! Berkasnya belum habis tapi Dio sudah berhenti.',
    tantangan: 'Jadilah detektif kode! Cari balok yang kurang, lalu perbaiki agar semua foto dan tugas tersimpan rapi.',
    aturanKhusus: '🔍 <b>Petunjuk Detektif:</b> Periksa bagian <i>"kalau bukan foto"</i>, tambahkan balok untuk menyimpan tugasnya! 💡',
    misi: 'Program temanmu berhenti di tengah jalan, padahal berkasnya belum habis. Cari bagian yang kurang, lalu perbaiki ya!',
    awal: { blocks: { languageVersion: 0, blocks: [{ type: 'mulai', deletable: false, movable: false, x: 20, y: 20, next: { block: { type: 'ulangi', fields: { N: 4 },
      inputs: { DO: { block: { type: 'ambil', next: { block: { type: 'jika_jenis', fields: { J: 'foto' }, inputs: { THEN: { block: { type: 'simpan_album' } } } } } } } } } } }] } }
  }
];

/* ---------- Interpreter (murni, bisa diuji tanpa Blockly) ---------- */
function simulate(L, first) {
  const q = L.items.map(o => ({ ...o })), st = { hand: null, album: 0, tugas: 0, kirim: 0 }, steps = [];
  let fail = null, n = 0;
  const snap = (b) => steps.push({ q: q.map(o => ({ ...o })), hand: st.hand && { ...st.hand }, album: st.album, tugas: st.tugas, kirim: st.kirim, id: b.id, t: b.type });
  const bad = (msg, b) => { fail = { msg, type: b.type, id: b.id }; };
  function run(b) {
    while (b && !fail) {
      if (++n > 300) { fail = { msg: 'Dio kelelahan, programnya terlalu panjang 😴', type: 'loop' }; return; }
      const t = b.type;
      if (t === 'ulangi') { for (let i = 0; i < b.getFieldValue('N') && !fail; i++) run(b.getInputTargetBlock('DO')); }
      else if (t === 'jika_jenis' || t === 'jika_rahasia') {
        if (!st.hand) bad('Dio belum memegang dokumen, jadi belum bisa mengintip jenisnya 🧐', b);
        else { const yes = t === 'jika_jenis' ? st.hand.j === b.getFieldValue('J') : st.hand.r; run(b.getInputTargetBlock(yes ? 'THEN' : 'ELSE')); }
      } else {
        if (t === 'ambil') {
          if (st.hand) bad('Aduh, tangan Dio masih memegang dokumen! 🙈', b);
          else if (!q.length) bad('Dokumen di ban berjalan sudah habis, jadi Dio tidak bisa mengambil lagi 😅', b);
          else st.hand = q.shift();
        }
        else if (!st.hand) bad('Tangan Dio kosong 😅 Ambil dokumen dulu ya!', b);
        else if (t === 'simpan_album') { if (st.hand.j !== 'foto') bad('Ups, itu bukan foto! Tugas jadi masuk ke Album 😵', b); else { st.album++; st.hand = null; } }
        else if (t === 'simpan_tugas') { if (st.hand.j !== 'tugas') bad('Ups, itu bukan tugas! Foto jadi masuk ke folder Tugas 😵', b); else { st.tugas++; st.hand = null; } }
        else if (t === 'beri_sandi') st.hand.s = true;
        else if (t === 'kirim') {
          if (st.hand.r && !st.hand.s) bad('Waduh! Dokumen rahasia terkirim tanpa digembok 😱 Isinya bisa dibaca orang lain. Beri sandi dulu ya!', b);
          else { st.kirim++; st.hand = null; }
        }
        snap(b);
      }
      b = b.getNextBlock();
    }
  }
  run(first);
  return { steps, fail, ok: !fail && !q.length && !st.hand, left: q.length + (st.hand ? 1 : 0) };
}

/* ---------- Balok kustom ---------- */
const sq = { previousStatement: null, nextStatement: null };
Blockly.defineBlocksWithJsonArray([
  { type: 'mulai', message0: '▶ Mulai', nextStatement: null, colour: '#7BCB5A' },
  { type: 'ambil', message0: '📥 ambil dokumen', ...sq, colour: '#FF7EB6' },
  { type: 'kirim', message0: '✉️ kirim dokumen', ...sq, colour: '#FFA94D' },
  { type: 'simpan_album', message0: '📷 simpan ke Album', ...sq, colour: '#4FC38A' },
  { type: 'simpan_tugas', message0: '📄 simpan ke folder Tugas', ...sq, colour: '#5AA9FF' },
  { type: 'beri_sandi', message0: '🔒 beri sandi (gembok)', ...sq, colour: '#A98BFF' },
  { type: 'ulangi', message0: '🔁 ulangi %1 kali', args0: [{ type: 'field_number', name: 'N', value: 2, min: 1, max: 20, precision: 1 }],
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], ...sq, colour: '#F2A516' },
  { type: 'jika_jenis', message0: '🤔 jika ini %1', args0: [{ type: 'field_dropdown', name: 'J', options: [['foto 📷', 'foto'], ['tugas 📄', 'tugas']] }],
    message1: 'maka %1', args1: [{ type: 'input_statement', name: 'THEN' }], message2: 'kalau bukan %1', args2: [{ type: 'input_statement', name: 'ELSE' }], ...sq, colour: '#26B8CC' },
  { type: 'jika_rahasia', message0: '🤔 jika dokumen RAHASIA 📕', message1: 'maka %1', args1: [{ type: 'input_statement', name: 'THEN' }], ...sq, colour: '#26B8CC' }
]);

/* ---------- Logger & Status Sesi ---------- */
const session = 'S' + Math.random().toString(16).slice(2, 6); // ID pseudonim, tanpa nama anak
const t0 = Date.now(), LOG = [], EV = ['create', 'move', 'delete', 'change'];
let sent = 0, flushing = false, cur = 0, loading = false, busy = false, timers = [], mStart = 0, mOpen = false, solved = false, ws;

/* ---------- Progres Misi (Level Locking) ---------- */
let maxUnlocked = 0;
const solvedSet = new Set();

try {
  const saved = JSON.parse(sessionStorage.getItem('dio_game_progress_' + session) || '{}');
  if (typeof saved.maxUnlocked === 'number') maxUnlocked = saved.maxUnlocked;
  if (Array.isArray(saved.solved)) saved.solved.forEach(x => solvedSet.add(x));
} catch(e) {}

function saveProgress() {
  try {
    sessionStorage.setItem('dio_game_progress_' + session, JSON.stringify({
      maxUnlocked,
      solved: Array.from(solvedSet)
    }));
  } catch(e) {}
}

const $ = id => document.getElementById(id), now = () => Math.round((Date.now() - t0) / 100) / 10;
function status() { $('info').textContent = 'Sesi ' + session + ' | ☁️ ' + sent + '/' + LOG.length + (sb ? '' : ' (belum terhubung, log lokal)'); }
function log(o) { LOG.push({ session_id: session, mission_id: LV[cur].id, timestamp_rel: now(), ...o }); status(); if (LOG.length - sent >= 30) flush(); }
async function flush() {
  if (!sb || flushing || sent >= LOG.length) return; flushing = true; const upto = LOG.length;
  try { const { error } = await sb.from('interaction_logs').insert(LOG.slice(sent, upto)); if (!error) sent = upto; else console.warn(error.message); }
  catch (e) { console.warn(e); }
  flushing = false; status();
}
function summary(reason) {
  const ev = LOG.slice(mStart), runs = ev.filter(e => e.event_type === 'run' && e.execution_result && e.execution_result.reason !== 'over_limit'), last = runs.length ? runs[runs.length - 1].program_snapshot : '';
  return { reason, runs: runs.length, failed_runs: runs.filter(e => !e.execution_result.ok).length, first_attempt_success: runs.length > 0 && runs[0].execution_result.ok,
    over_limit: ev.filter(e => e.execution_result && e.execution_result.reason === 'over_limit').length, edits: ev.filter(e => EV.includes(e.event_type)).length,
    duration: Math.round((now() - ev[0].timestamp_rel) * 10) / 10, used_repeat: last.includes('ulangi'), used_condition: last.includes('jika_') };
}
function endMission(reason) { log({ event_type: 'mission_end', execution_result: summary(reason) }); mOpen = false; flush(); }
document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

/* ---------- Tampilan & UI ---------- */
const KELOMPOK = [['🏃 Aksi', '#FF7EB6', ['ambil', 'kirim', 'simpan_album', 'simpan_tugas', 'beri_sandi']], ['🔁 Ulangi', '#F2A516', ['ulangi']], ['🤔 Jika', '#26B8CC', ['jika_jenis', 'jika_rahasia']]];
const toolbox = L => ({ kind: 'categoryToolbox', contents: KELOMPOK.map(([name, colour, ts]) => ({ kind: 'category', name, colour, contents: ts.filter(t => L.tools.includes(t)).map(type => ({ kind: 'block', type })) })).filter(c => c.contents.length) });
const BICARA = { ambil: 'Hup! Dokumennya kuambil 📥', kirim: 'Wussh! Terkirim ✉️', simpan_album: 'Foto masuk Album 📷', simpan_tugas: 'Tugas masuk folder Tugas 📄', beri_sandi: 'Klik! Digembok 🔒' };
const em = o => o.r ? (o.s ? '📕🔒' : '📕') : (o.j === 'foto' ? '📷' : '📄');
const bicara = m => { $('bicara').textContent = m; };

function ser(b) {
  const o = [];
  while (b) {
    const t = b.type;
    if (t === 'ulangi') o.push('ulangi(' + b.getFieldValue('N') + '){' + ser(b.getInputTargetBlock('DO')) + '}');
    else if (t === 'jika_jenis') o.push('jika_jenis(' + b.getFieldValue('J') + '){' + ser(b.getInputTargetBlock('THEN')) + '}else{' + ser(b.getInputTargetBlock('ELSE')) + '}');
    else if (t === 'jika_rahasia') o.push('jika_rahasia{' + ser(b.getInputTargetBlock('THEN')) + '}');
    else o.push(t);
    b = b.getNextBlock();
  }
  return o.join(';');
}
const startBlock = () => ws.getTopBlocks(false).find(b => b.type === 'mulai');

function draw(st) {
  const L = LV[cur], hitung = [];
  if (L.tools.includes('kirim')) hitung.push('<span>✉️ Terkirim: ' + st.kirim + '</span>');
  if (L.tools.includes('simpan_album')) hitung.push('<span>📷 Album: ' + st.album + '</span>');
  if (L.tools.includes('simpan_tugas')) hitung.push('<span>📄 Tugas: ' + st.tugas + '</span>');
  $('stage').innerHTML =
    '<div class="rak"><span class="label">Ban berjalan</span><div class="ban">' + (st.q.length ? st.q.map((o, i) => '<span class="chip' + (i === 0 ? ' depan' : '') + '">' + em(o) + '</span>').join('') : '<span class="kosong">kosong</span>') + '</div></div>' +
    '<div class="rak"><span class="label">Tangan Dio 🤖</span><div class="tangan">' + (st.hand ? '<span class="chip pop">' + em(st.hand) + '</span>' : '<span class="kosong">kosong</span>') + '</div></div>' +
    '<div class="skor">' + hitung.join('') + '</div>';
}

function pesan(html, kelas) { const p = $('pesan'); p.className = 'pesan ' + (kelas || ''); p.innerHTML = html; }

/* Render Kartu Misi Interaktif & Mudah Dibaca Anak */
function renderMisi(L) {
  const isDone = solvedSet.has(cur);
  const statusBadge = isDone
    ? '<span class="status-badge selesai">✅ Selesai</span>'
    : '<span class="status-badge aktif">⚡ Sedang Dikerjakan</span>';

  let extras = '';
  if (L.aturanKhusus) {
    extras += `<div class="info-kotak">${L.aturanKhusus}</div>`;
  }

  $('misi').innerHTML = `
    <div class="misi-header">
      <div class="misi-header-left">
        <span class="misi-chip">Misi ${L.nomor}</span>
        <h2 class="misi-title">${L.nama}</h2>
      </div>
      <div class="misi-header-right">
        ${statusBadge}
      </div>
    </div>
    <div class="misi-cerita">${L.cerita || L.misi}</div>
    <div class="misi-target-card">
      <div class="target-title">🎯 <b>Tantanganmu:</b></div>
      <div class="target-desc">${L.tantangan || L.misi}</div>
    </div>
    ${extras}
  `;
}

/* Render Tab Navigasi Misi dengan Sistem Kunci (Level Locking) */
function renderTabs() {
  const tabs = $('tabs');
  tabs.innerHTML = '';
  LV.forEach((l, i) => {
    const isLocked = i > maxUnlocked;
    const isDone = solvedSet.has(i);
    const isActive = i === cur;

    const b = document.createElement('button');
    b.className = 'lv' + (isActive ? ' on' : '') + (isDone ? ' done' : '') + (isLocked ? ' locked' : '');
    
    let icon = isDone ? '✅' : (isLocked ? '🔒' : '⭐');
    b.innerHTML = `<span class="lv-icon">${icon}</span> <span class="lv-txt">${l.nama}</span>`;
    b.title = isLocked ? 'Misi ini masih terkunci. Selesaikan misi sebelumnya terlebih dahulu!' : l.nama;

    b.onclick = () => {
      if (isLocked) {
        pesan('🔒 <b>Misi ini masih terkunci!</b><br>Selesaikan misi sebelumnya terlebih dahulu ya! Semangat! 💪', 'peringatan');
        b.classList.add('shake');
        setTimeout(() => b.classList.remove('shake'), 450);
        return;
      }
      loadLevel(i);
    };
    tabs.appendChild(b);
  });
}

/* Partikel Konfeti Selebrasi Kemenangan */
function triggerCelebration() {
  const colors = ['#ff528f', '#48db80', '#ffa526', '#3b9eff', '#ffd23f', '#a855f7'];
  for (let i = 0; i < 35; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    el.style.animationDelay = (Math.random() * 0.3) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
}

function setup() {
  const L = LV[cur];
  loading = true;
  ws.clear();
  Blockly.serialization.workspaces.load(L.awal || START, ws);
  ws.updateToolbox(toolbox(L));
  loading = false;
  ws.highlightBlock(null);

  renderTabs();
  renderMisi(L);
  draw({ q: L.items, hand: null, album: 0, tugas: 0, kirim: 0 });

  bicara('Ayo susun balok-balokku, lalu tekan Jalankan! 🚀');
  pesan('Tarik balok dari menu di sebelah kiri ke bawah balok "▶ Mulai".');
}

function loadLevel(i) {
  if (mOpen && !solved && LOG.length - mStart > 1) endMission('abandoned');
  timers.forEach(clearTimeout);
  timers = [];
  busy = false;
  $('btnRun').disabled = false;
  cur = i;
  solved = solvedSet.has(i);
  setup();
  mStart = LOG.length;
  mOpen = true;
  log({ event_type: 'mission_start' });
}

function jalankan() {
  if (busy) return;
  const L = LV[cur];
  const jumlah = ws.getAllBlocks(false).filter(b => b.type !== 'mulai').length;
  const prog = ser(startBlock().getNextBlock());

  if (L.max && jumlah > L.max) {
    pesan('Wah, balokmu ada ' + jumlah + ', padahal batasnya ' + L.max + '. Coba cari cara yang lebih singkat ya! 💡', 'gagal');
    log({ event_type: 'run', program_snapshot: prog, execution_result: { ok: false, reason: 'over_limit' } });
    return;
  }

  const r = simulate(L, startBlock().getNextBlock());
  log({ event_type: 'run', program_snapshot: prog, execution_result: { ok: r.ok, stopped_at: r.fail ? r.fail.type : null, left: r.left } });
  busy = true;
  $('btnRun').disabled = true;
  pesan('Dio sedang bekerja... ⚙️');

  r.steps.forEach((st, i) => timers.push(setTimeout(() => {
    draw(st);
    ws.highlightBlock(st.id);
    bicara(BICARA[st.t] || '...');
  }, i * 450)));

  timers.push(setTimeout(() => {
    ws.highlightBlock(null);
    busy = false;
    $('btnRun').disabled = false;

    if (r.ok) {
      bicara('Yeay! Semua tugas beres sempurna! 🎉');
      solved = true;
      solvedSet.add(cur);

      // Buka kunci misi berikutnya!
      if (cur + 1 < LV.length && maxUnlocked < cur + 1) {
        maxUnlocked = cur + 1;
      }
      saveProgress();
      renderTabs();
      renderMisi(L);
      triggerCelebration();

      if (cur < LV.length - 1) {
        pesan(`
          <div class="pesan-sukses-box">
            <div class="pesan-bintang">⭐ ⭐ ⭐</div>
            <div class="pesan-judul">🎉 HORE, BERHASIL! 🎉</div>
            <p class="pesan-sub">Misi ${L.nomor} selesai! Misi ${cur + 2} sekarang sudah terbuka 🔓</p>
            <button class="lanjut bounce" id="btnLanjut">Lanjut ke Misi ${cur + 2} ➡️</button>
          </div>
        `, 'sukses');
        $('btnLanjut').onclick = () => loadLevel(cur + 1);
      } else {
        pesan(`
          <div class="pesan-sukses-box">
            <div class="pesan-bintang">🏆 🌟 🏆</div>
            <div class="pesan-judul">🎓 SELAMAT, KAMU AGEN DATA JUARA! 🎓</div>
            <p class="pesan-sub">Luar biasa! Kamu telah berhasil menuntaskan semua misi Dio dengan sempurna! 🚀</p>
          </div>
        `, 'sukses');
      }

      endMission('solved');
    } else if (r.fail) {
      bicara('Hmm, ada yang belum pas. Kita coba lagi yuk!');
      pesan(r.fail.msg + ' Lihat balok yang menyala ✨ lalu coba ubah.', 'gagal');
      if (r.fail.id) ws.highlightBlock(r.fail.id);
    } else {
      bicara('Masih ada yang tersisa nih.');
      pesan('Masih ada ' + r.left + ' dokumen yang belum beres di ban berjalan. Coba lagi ya! 💪', 'gagal');
    }
  }, (r.steps.length + 1) * 450));
}

function init() {
  const kecil = window.matchMedia('(max-width:700px)').matches;
  const tema = Blockly.Theme.defineTheme('anak', {
    base: Blockly.Themes.Classic,
    fontStyle: { family: 'Nunito, "Trebuchet MS", sans-serif', weight: '800', size: 13 },
    componentStyles: {
      workspaceBackgroundColour: '#fffaf0',
      toolboxBackgroundColour: '#ffeef8',
      toolboxForegroundColour: '#5b3b6b',
      flyoutBackgroundColour: '#fff1f8',
      flyoutForegroundColour: '#5b3b6b',
      flyoutOpacity: 0.95,
      scrollbarColour: '#ffb6d9'
    }
  });

  ws = Blockly.inject('blocklyDiv', {
    toolbox: { kind: 'categoryToolbox', contents: [] },
    theme: tema,
    trashcan: true,
    scrollbars: true,
    horizontalLayout: kecil,
    toolboxPosition: 'start',
    zoom: { controls: true, startScale: kecil ? 0.9 : 1, minScale: 0.6, maxScale: 1.4 }
  });

  ws.addChangeListener(e => {
    if (loading || e.isUiEvent || !EV.includes(e.type)) return;
    const b = e.blockId && ws.getBlockById(e.blockId);
    log({ event_type: e.type, execution_result: { block: (b && b.type) || (e.oldJson && e.oldJson.type) || null } });
  });

  $('btnRun').onclick = jalankan;
  $('btnReset').onclick = () => {
    timers.forEach(clearTimeout);
    timers = [];
    busy = false;
    $('btnRun').disabled = false;
    setup();
    log({ event_type: 'reset' });
  };
  $('btnLog').onclick = (e) => {
    e.preventDefault();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(LOG, null, 1)], { type: 'application/json' }));
    a.download = 'log_' + session + '.json';
    a.click();
  };

  status();
  renderTabs();
  loadLevel(0);
}

(document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
