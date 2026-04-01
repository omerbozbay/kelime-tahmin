import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Settings,
  Play,
  Plus,
  X,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
  RotateCcw,
  Trophy,
  Skull,
  UserCheck,
  Gamepad2,
  Trash2
} from 'lucide-react';
import { categories } from './data/words';
import confetti from 'canvas-confetti';
import './index.css';

const App = () => {
  const _motion = motion;
  // Game States: HOME, SETUP_PLAYERS, SETUP_CATEGORY, DISTRIBUTION, GAME_PLAY, RESULT
  const [gameState, setGameState] = useState('HOME');
  const [players, setPlayers] = useState(['Eren', 'Ömer', 'Kaan', 'Muhammet']);
  const [imposterCount, setImposterCount] = useState(1);
  // Multiple categories can be selected
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [gameData, setGameData] = useState({
    word: '',
    hint: '',
    playerRoles: [], // { name, role: 'PLAYER'|'IMPOSTER', revealed: false }
    starterIndex: 0
  });
  const [activeRevealIndex, setActiveRevealIndex] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showHowTo, setShowHowTo] = useState(false);

  // ---------------------------------------------------------
  // 1. HOME SCREEN
  // ---------------------------------------------------------
  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="container"
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', width: 120, height: 120, borderRadius: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(99,102,241,0.5)', marginBottom: 24 }}
        >
          <Skull size={60} color="white" strokeWidth={1.5} />
        </motion.div>

        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: 8 }}>İmposter Kim?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '300px' }}>
          Aranızdaki sahtekarı bulun!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        <button className="btn-primary" onClick={() => setGameState('SETUP_PLAYERS')}>
          Oyunu Başlat
        </button>
        <button className="btn-secondary" onClick={() => setShowHowTo(true)}>
          Nasıl Oynanır?
        </button>
      </div>

      <p style={{ textAlign: 'center', marginBottom: 20, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Türkçe olarak tasarlandı.
      </p>
    </motion.div>
  );

  // ---------------------------------------------------------
  // 2. PLAYER SETUP
  // ---------------------------------------------------------
  const addPlayer = (e) => {
    e?.preventDefault();
    if (players.length >= 20) return;
    if (newPlayerName.trim()) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index) => {
    if (players.length > 3) {
      const nextPlayers = players.filter((_, i) => i !== index);
      setPlayers(nextPlayers);
      setImposterCount((prev) => Math.min(Math.max(prev, 1), Math.max(1, nextPlayers.length - 1)));
    }
  };

  const renderSetupPlayers = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="container"
    >
      <header style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button
            className="btn-secondary"
            style={{ padding: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setGameState('HOME')}
          >
            <ChevronRight style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem' }}>Oyuncuları Ekle</h2>
            <p style={{ color: 'var(--text-muted)' }}>En az 3, en fazla 20 oyuncu</p>
          </div>
        </div>
      </header>

      <form onSubmit={addPlayer} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="İsim yaz..."
          disabled={players.length >= 20}
          className="glass"
          style={{ flex: 1, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 12, outline: 'none' }}
        />
        <button type="submit" disabled={players.length >= 20} className="btn-primary" style={{ padding: '0 16px', opacity: players.length >= 20 ? 0.5 : 1 }}>
          <Plus />
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
        {players.map((p, i) => (
          <motion.div
            layout
            key={i}
            className="glass"
            style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{i + 1}</div>
              <span style={{ fontWeight: 500 }}>{p}</span>
            </div>
            <button
              onClick={() => removePlayer(i)}
              style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: 8, cursor: 'pointer' }}
              disabled={players.length <= 3}
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass" style={{ margin: '20px 0', padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>İmposter Sayısı</span>
          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{imposterCount}</span>
        </div>
        <input
          type="range"
          min="1"
          max={Math.max(1, players.length - 1)}
          value={imposterCount}
          onChange={(e) => setImposterCount(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', marginBottom: 20 }}
        onClick={() => setGameState('SETUP_CATEGORY')}
      >
        Kategori Seç
      </button>
    </motion.div>
  );

  // ---------------------------------------------------------
  // 3. CATEGORY SETUP (multiple selection)
  // ---------------------------------------------------------
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const renderSetupCategory = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="container"
    >
      <header style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button
            className="btn-secondary"
            style={{ padding: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setGameState('SETUP_PLAYERS')}
          >
            <ChevronRight style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.8rem' }}>Kategori Seç</h2>
            <p style={{ color: 'var(--text-muted)' }}>Tahmin edilecek kelime gruplarını seçin (birden fazla)</p>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button
          className="btn-secondary"
          style={{ flex: 1 }}
          onClick={() => setSelectedCategories(Object.keys(categories))}
        >
          Tümünü Seç
        </button>
        <button
          className="btn-secondary"
          style={{ flex: 1 }}
          onClick={() => setSelectedCategories([])}
        >
          Temizle
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, paddingBottom: 20 }}>
        {Object.keys(categories).map((cat) => (
          <motion.div
            whileTap={{ scale: 0.95 }}
            key={cat}
            className={`glass ${selectedCategories.includes(cat) ? 'active-cat' : ''}`}
            onClick={() => toggleCategory(cat)}
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: selectedCategories.includes(cat) ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
              background: selectedCategories.includes(cat) ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>
              {cat === 'Hayvanlar' ? '🦁' :
                cat === 'Yiyecekler' ? '🍕' :
                  cat === 'Nesneler' ? '📦' :
                    cat === 'Film/Dizi' ? '🎬' :
                      cat === 'Mekanlar' ? '📍' :
                        cat === 'Sporlar' ? '⚽' :
                          cat === 'Meslekler' ? '👷' :
                            cat === 'Markalar' ? '💎' :
                              cat === 'Araçlar' ? '🚗' :
                                cat === 'Süper Güçler' ? '⚡' :
                                  cat === 'Korkular' ? '👻' :
                                    cat === 'Ünlüler' ? '🌟' :
                                      cat === 'Oyunlar' ? '🎮' :
                                        cat === 'Hobiler' ? '🎸' :
                                          cat === 'Ülkeler' ? '🌍' :
                                            cat === 'Şehirler' ? '🏙️' : '❓'}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          className="btn-primary"
          disabled={selectedCategories.length === 0}
          style={{ flex: 1, opacity: selectedCategories.length === 0 ? 0.5 : 1 }}
          onClick={startGame}
        >
          Hazırız!
        </button>
      </div>
    </motion.div>
  );

  const startGame = () => {
    // Choose a random category from selected ones
    const cat = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
    setCurrentCategory(cat);
    const catWords = categories[cat];
    const randomIndex = Math.floor(Math.random() * catWords.length);
    const selectedItem = catWords[randomIndex];
    const selectedWord = Array.isArray(selectedItem) ? selectedItem[0] : selectedItem.word;
    const selectedHint = Array.isArray(selectedItem) ? selectedItem[1] : selectedItem.hint;
    const starterIndex = Math.floor(Math.random() * players.length);

    // Distribute roles
    let roles = players.map((name) => ({ name, role: 'PLAYER', revealed: false }));
    const imposterIndices = new Set();
    const safeImposterCount = Math.min(Math.max(imposterCount, 1), Math.max(players.length - 1, 1));
    while (imposterIndices.size < safeImposterCount) {
      imposterIndices.add(Math.floor(Math.random() * players.length));
    }
    imposterIndices.forEach((idx) => {
      roles[idx].role = 'IMPOSTER';
    });

    setGameData({
      word: selectedWord,
      hint: selectedHint,
      playerRoles: roles,
      starterIndex
    });
    setGameState('DISTRIBUTION');
  };

  // ---------------------------------------------------------
  // 4. DISTRIBUTION (Player reveal)
  // ---------------------------------------------------------
  const handleReveal = (index) => {
    if (gameData.playerRoles[index].revealed) return;
    setActiveRevealIndex(index);
  };

  const confirmReveal = () => {
    const newRoles = [...gameData.playerRoles];
    newRoles[activeRevealIndex].revealed = true;
    setGameData({ ...gameData, playerRoles: newRoles });
    setActiveRevealIndex(null);

    if (newRoles.every((p) => p.revealed)) {
      setTimeout(() => {
        setGameState('GAME_PLAY');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }, 500);
    }
  };

  const renderDistribution = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container"
    >
      <header style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Kelimeni Gör</h2>
        <p style={{ color: 'var(--text-muted)' }}>Sırayla ismine tıklayıp kelimeni gizlice oku!</p>
      </header>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignContent: 'start' }}>
        {gameData.playerRoles.map((p, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.95 }}
            className="glass"
            onClick={() => handleReveal(i)}
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: p.revealed ? 0.3 : 1,
              background: p.revealed ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))'
            }}
          >
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              {p.revealed ? <UserCheck size={20} color="var(--success)" /> : <Users size={20} />}
            </div>
            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{p.name}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeRevealIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
              padding: 24
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="glass"
              style={{ width: '100%', maxWidth: 400, padding: 32, textAlign: 'center' }}
            >
              <h3 style={{ marginBottom: 16, color: 'var(--text-muted)' }}>Selam, <span style={{ color: 'white' }}>{gameData.playerRoles[activeRevealIndex].name}</span></h3>
              <div style={{ marginBottom: 32 }}>
                {gameData.playerRoles[activeRevealIndex].role === 'IMPOSTER' ? (
                  <>
                    <Skull size={64} color="#ef4444" style={{ marginBottom: 16 }} />
                    <h2 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: 8 }}>İmpostersun!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Kelimeyi bilmiyorsun ama sana bir ipucu veriyoruz:</p>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px dashed #ef4444', padding: 20, borderRadius: 16, fontSize: '1.5rem', fontWeight: 'bold' }}>{gameData.hint}</div>
                    {/* Show the category for imposters as well */}
                    <p style={{ color: 'var(--text-muted)', marginTop: 12, marginBottom: 8 }}>Kategori:</p>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: 12, borderRadius: 12, fontSize: '1.2rem', fontWeight: 'bold' }}>{currentCategory}</div>
                  </>
                ) : (
                  <>
                    <Eye size={64} color="var(--primary)" style={{ marginBottom: 16 }} />
                    <h2 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: 8 }}>Kelimen:</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Bu kelimeyi diğerlerine çaktırmadan anlat.</p>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '2px solid var(--primary)', padding: 20, borderRadius: 16, fontSize: '1.8rem', fontWeight: 'bold' }}>{gameData.word}</div>
                    {/* Show the category for normal players */}
                    <p style={{ color: 'var(--text-muted)', marginTop: 12, marginBottom: 8 }}>Kategori:</p>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', padding: 12, borderRadius: 12, fontSize: '1.2rem', fontWeight: 'bold' }}>{currentCategory}</div>
                  </>
                )}
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={confirmReveal}>Gördüm, Kapat</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ---------------------------------------------------------
  // 5. GAME PLAY
  // ---------------------------------------------------------
  const renderGamePlay = () => {
    const roles = gameData.playerRoles ?? [];
    const safeStarterIndex = roles.length ? ((gameData.starterIndex % roles.length) + roles.length) % roles.length : 0;
    const order = roles.length ? roles.slice(safeStarterIndex).concat(roles.slice(0, safeStarterIndex)).map((p) => p.name) : [];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container"
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div className="pulse" style={{ position: 'absolute', inset: -20, background: 'var(--primary)', borderRadius: '50%', opacity: 0.1 }}></div>
            <Gamepad2 size={60} color="var(--primary)" />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Tartışma Zamanı</h2>

          <div className="glass" style={{ padding: 20, width: '100%', marginBottom: 14 }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              Herkes sırayla <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>"{currentCategory}"</span> kategorisindeki kelimeyi anlatıyor.
            </p>
            <div style={{ marginTop: 10, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              İlk başlayan: <span style={{ color: 'white', fontWeight: 600 }}>{order[0] ?? '-'}</span>
            </div>
          </div>

          <div className="glass" style={{ padding: 14, width: '100%', marginBottom: 14 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 10 }}>Konuşma sırası</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {order.map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 999,
                    background: idx === 0 ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'white'
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 16, width: '100%' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontSize: '0.9rem' }}>
              <Skull size={14} color="#ef4444" />
              <span>İçinizde <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{imposterCount}</span> sahtekar var!</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, width: '100%' }}>
          <button className="btn-primary" style={{ width: '100%', background: '#ef4444' }} onClick={() => setGameState('RESULT')}>
            Kimlikleri Açıkla
          </button>
        </div>
      </motion.div>
    );
  };

  // ---------------------------------------------------------
  // 6. RESULT
  // ---------------------------------------------------------
  const renderResult = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="container"
    >
      <header style={{ marginBottom: 24, textAlign: 'center' }}>
        <Trophy size={48} color="var(--accent)" style={{ marginBottom: 12 }} />
        <h2 style={{ fontSize: '1.8rem' }}>Sonuçlar</h2>
        <p style={{ color: 'var(--text-muted)' }}>İşte kimin ne olduğu!</p>
      </header>

      <div className="glass" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Aranan Kelime:</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{gameData.word}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Kategori:</div>
        <div style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--accent)' }}>{currentCategory}</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', marginBottom: 20 }}>
        {gameData.playerRoles.map((p, i) => (
          <div key={i} className="glass" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', borderLeft: p.role === 'IMPOSTER' ? '4px solid #ef4444' : '4px solid var(--success)' }}>
            <span style={{ fontWeight: 600 }}>{p.name}</span>
            <span style={{ color: p.role === 'IMPOSTER' ? '#ef4444' : 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: 1 }}>
              {p.role === 'IMPOSTER' ? 'SAHTEKAR' : 'OYUNCU'}
            </span>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={() => setGameState('SETUP_CATEGORY')}>
        Yeni Tur
      </button>
    </motion.div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AnimatePresence mode="wait">
        {gameState === 'HOME' && renderHome()}
        {gameState === 'SETUP_PLAYERS' && renderSetupPlayers()}
        {gameState === 'SETUP_CATEGORY' && renderSetupCategory()}
        {gameState === 'DISTRIBUTION' && renderDistribution()}
        {gameState === 'GAME_PLAY' && renderGamePlay()}
        {gameState === 'RESULT' && renderResult()}
      </AnimatePresence>

      <AnimatePresence>
        {showHowTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: 20
            }}
            onClick={() => setShowHowTo(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="glass"
              style={{ width: '100%', maxWidth: 520, padding: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <h3 style={{ fontSize: '1.4rem' }}>Nasıl Oynanır?</h3>
                <button
                  onClick={() => setShowHowTo(false)}
                  style={{ background: 'transparent', border: 'none', color: 'white', padding: 8, cursor: 'pointer' }}
                >
                  <X />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                <div className="glass" style={{ padding: 14 }}>
                  <div style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>1) Kurulum</div>
                  <div>Oyuncuları ekle, sahtekar sayısını seç, bir veya daha fazla kategori işaretle.</div>
                </div>
                <div className="glass" style={{ padding: 14 }}>
                  <div style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>2) Gizli Dağıtım</div>
                  <div>Herkes sırayla kendi ismine tıklar. Oyuncular kategori + kelimeyi görür. Sahtekar kategori + tek kelimelik ipucunu görür.</div>
                </div>
                <div className="glass" style={{ padding: 14 }}>
                  <div style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>3) Konuşma Turları</div>
                  <div>Oyuncular sırayla kelimeyi ele vermeden çağrışım yapar. Sahtekar da yakalanmadan uydurmaya çalışır.</div>
                </div>
                <div className="glass" style={{ padding: 14 }}>
                  <div style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>4) Oylama</div>
                  <div>Tartışıp sahtekar(lar)ı bulmaya çalışın. Son turda “Kimlikleri Açıkla” ile roller ortaya çıkar.</div>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => setShowHowTo(false)}>
                Tamam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
