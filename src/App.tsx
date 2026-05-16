/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Settings, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  LogOut,
  ChevronRight,
  MoreVertical,
  Minus
} from 'lucide-react';

// --- TYPES ---

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string; // Formato: "Italiano // English"
  image: string;
}

interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
}

const DEFAULT_MENU: MenuCategory[] = [
  {
    id: 'antipasti',
    title: 'Gli Antipasti',
    items: [
      {
        id: 'a1',
        name: 'Tagliere Rustico della Nonna',
        price: '16,00',
        description: 'Selezione di pregiati salumi locali, formaggi di malga e sottoli della casa // Selection of fine local cured meats, mountain cheeses and homemade pickles',
        image: 'immagini/antipasto1.jpg'
      }
    ]
  },
  {
    id: 'primi',
    title: 'I Primi del Cuore',
    items: [
      {
        id: 'p1',
        name: 'Tagliatelle al Ragù Antico',
        price: '14,00',
        description: 'Pasta fresca all\'uovo trafilata al bronzo con ragù a cottura lenta // Bronze-drawn fresh egg pasta with slow-cooked meat sauce',
        image: 'immagini/primo1.jpg'
      }
    ]
  }
];

// --- COMPONENTS ---

const Header = ({ cover, isAdmin, onCoverChange }: { cover: string; isAdmin: boolean; onCoverChange: (img: string) => void }) => (
  <header className="relative w-full bg-white">
    <div className="h-[60vh] w-full relative overflow-hidden">
      <img
        src={cover}
        alt="Trattoria"
        className="w-full h-full object-cover scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559339352-260346387062?q=80&w=1200&auto=format&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      
      {isAdmin && (
        <div className="absolute bottom-10 right-10 z-30">
          <label className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-black/5 text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-all shadow-xl">
            <Edit3 size={12} /> Cambia Copertina
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => onCoverChange(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      )}
    </div>

    <div className="absolute top-12 left-12 z-10">
      <div className="w-16 h-16 bg-white p-0.5 shadow-sm">
        <img
          src="immagini/logo.jpg"
          alt="Logo"
          className="w-full h-full object-cover grayscale"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=TN&background=1a1a1a&color=fff&size=200&font-family=Playfair+Display';
          }}
        />
      </div>
    </div>

    <div className="px-12 -mt-32 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <h1 className="font-serif text-7xl font-bold tracking-tighter text-[#1A1A1A] leading-[0.9]">
          Trattoria <br />
          <span className="italic font-light text-5xl opacity-40">Della Nonna</span>
        </h1>
        
        <div className="mt-16 space-y-4 text-[9px] font-bold uppercase tracking-[0.4em] text-black/20">
          <div className="flex items-center gap-4">
            <MapPin size={10} />
            <span>Monterosso al Mare / Italia</span>
          </div>
          <div className="flex items-center gap-4">
            <Clock size={10} />
            <span>Aperti / 19:30 — 23:30</span>
          </div>
        </div>
      </motion.div>
    </div>
  </header>
);

const CategoryManager = ({ 
  categories, 
  onSave, 
  onCancel 
}: { 
  categories: MenuCategory[]; 
  onSave: (cats: MenuCategory[]) => void; 
  onCancel: () => void;
}) => {
  const [localCats, setLocalCats] = useState(categories);

  const addCategory = () => {
    const newCat: MenuCategory = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nuova Categoria',
      items: []
    };
    setLocalCats([...localCats, newCat]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-sm p-10 shadow-[0_30px_100px_rgba(0,0,0,0.3)]"
      >
        <div className="flex justify-between items-center mb-10">
          <h3 className="font-serif text-3xl italic">Struttura Menù</h3>
          <button onClick={onCancel} className="text-gray-300 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-8 pr-2 no-scrollbar">
          {localCats.map((cat, idx) => (
            <div key={cat.id} className="group flex items-center gap-4 bg-[#F8F6F6] p-4 border border-transparent focus-within:border-black/10">
              <span className="text-[10px] font-bold text-black/10 w-4">{idx + 1}</span>
              <input 
                value={cat.title} 
                onChange={(e) => setLocalCats(localCats.map(c => c.id === cat.id ? { ...c, title: e.target.value } : c))}
                className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest flex-1 outline-none"
              />
              <button 
                onClick={() => setLocalCats(localCats.filter(c => c.id !== cat.id))}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px] uppercase underline underline-offset-4"
              >
                Elimina
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={addCategory}
          className="w-full py-4 mb-4 flex items-center justify-center gap-3 border border-black/5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <Plus size={14} /> Nuova Categoria
        </button>

        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Annulla</button>
          <button onClick={() => onSave(localCats)} className="flex-1 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">Salva Tutto</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  // --- STATE ---
  const [menu, setMenu] = useState<MenuCategory[]>(() => {
    try {
      const saved = localStorage.getItem('trattoria_nonna_artisan');
      return saved ? JSON.parse(saved) : DEFAULT_MENU;
    } catch (e) {
      console.error("Failed to load menu", e);
      return DEFAULT_MENU;
    }
  });

  const [coverImage, setCoverImage] = useState<string>(() => {
    try {
      return localStorage.getItem('trattoria_nonna_cover') || 'immagini/copertina.jpg';
    } catch (e) {
      return 'immagini/copertina.jpg';
    }
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCatManager, setShowCatManager] = useState(false);
  const [password, setPassword] = useState('');
  const [editingItem, setEditingItem] = useState<{ catId: string; item: MenuItem | null; tempImage?: string } | null>(null);
  
  useEffect(() => {
    if (menu) {
      localStorage.setItem('trattoria_nonna_artisan', JSON.stringify(menu));
    }
  }, [menu]);

  useEffect(() => {
    if (coverImage) {
      localStorage.setItem('trattoria_nonna_cover', coverImage);
    }
  }, [coverImage]);

  // --- ACTIONS ---
  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('Access Denied.');
    }
  };

  const saveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const newItem: MenuItem = {
      id: editingItem.item?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      description: formData.get('description') as string,
      image: editingItem.tempImage || editingItem.item?.image || '',
    };

    setMenu(prev => prev.map(cat => {
      if (cat.id === editingItem.catId) {
        const index = cat.items.findIndex(i => i.id === newItem.id);
        const newItems = [...cat.items];
        if (index > -1) newItems[index] = newItem;
        else newItems.push(newItem);
        return { ...cat, items: newItems };
      }
      return cat;
    }));

    setEditingItem(null);
  };

  const deleteItem = (catId: string, itemId: string) => {
    if (window.confirm('Delete this item?')) {
      setMenu(prev => prev.map(cat => {
        if (cat.id === catId) {
          return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
        }
        return cat;
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative selection:bg-black selection:text-white shadow-2xl">
      {/* TASTO ADMIN SARTORIALE - TOP RIGHT PER NON OSTRUIRE */}
      {!isAdmin && (
        <button 
          onClick={() => setShowLogin(true)}
          className="absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md shadow-sm border border-black/5 rounded-full text-black/20 hover:text-black transition-all active:scale-95"
          title="Gestione Menù"
        >
          <Settings size={14} />
        </button>
      )}
      
      <Header cover={coverImage} isAdmin={isAdmin} onCoverChange={setCoverImage} />

      {/* NAVIGAZIONE CATEGORIE VERTICALE */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/5">
        <div className="px-12 py-8 flex items-center justify-between">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-1">
            {menu.map((cat) => (
              <a 
                key={cat.id} 
                href={`#${cat.id}`}
                className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors whitespace-nowrap"
              >
                {cat.title}
              </a>
            ))}
          </div>
          {isAdmin && (
            <button 
              onClick={() => setShowCatManager(true)}
              className="p-3 bg-black text-white hover:scale-110 transition-transform shadow-xl"
              title="Gestisci Categorie"
            >
              <Settings size={14} />
            </button>
          )}
        </div>
      </nav>

      {/* CONTENUTO MENU */}
      <main className="px-12 pt-20 pb-48">
        {menu.map((category) => (
          <section key={category.id} id={category.id} className="mb-32">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16 flex justify-between items-baseline border-b-2 border-black pb-4"
            >
              <h2 className="font-serif text-5xl italic font-light tracking-tighter text-[#1A1A1A]">{category.title}</h2>
              {isAdmin && (
                <button 
                  onClick={() => setEditingItem({ catId: category.id, item: null })}
                  className="flex items-center gap-2 text-[9px] font-bold text-black uppercase tracking-widest hover:underline"
                >
                  <Plus size={14} /> nuovo
                </button>
              )}
            </motion.div>

            <div className="space-y-24">
              {category.items.length > 0 ? (
                category.items.map((item) => {
                  const description = item.description || '';
                  const [it, en] = description.split('//').map(s => s.trim());
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="group flex flex-col"
                    >
                      <div className="relative w-full aspect-[4/3] mb-8 overflow-hidden bg-gray-100 shadow-sm">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[2s] ease-out group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute bottom-0 right-0 bg-black text-white px-6 py-2 text-sm font-serif italic">
                          € {item.price}
                        </div>

                        {isAdmin && (
                          <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-10 backdrop-blur-sm">
                            <button onClick={() => setEditingItem({ catId: category.id, item })} className="text-black border-b border-black font-bold text-[9px] uppercase tracking-[0.2em] py-1">
                              Modifica
                            </button>
                            <button onClick={() => deleteItem(category.id, item.id)} className="text-red-500 border-b border-red-500 font-bold text-[9px] uppercase tracking-[0.2em] py-1">
                              Elimina
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-serif text-3xl tracking-tighter leading-none group-hover:italic transition-all duration-500">{item.name}</h3>
                      </div>
                      
                      <p className="text-[14px] leading-relaxed font-light text-black/80 max-w-[280px]">
                        {it} 
                        {en && <span className="ml-2 text-black/30 font-light italic">— {en}</span>}
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-20 text-center border-2 border-black/5 text-[9px] font-bold uppercase tracking-[0.4em] text-black/10">
                  Pronto a breve
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="px-10 py-32 border-t border-black/5 text-center">
        <p className="font-serif text-2xl italic mb-12 opacity-40 leading-relaxed max-w-[240px] mx-auto">
          Cucinare è un atto d’amore, condividerlo è il nostro piacere.
        </p>
        <div className="flex justify-center gap-6 mb-16">
          {isAdmin && (
            <button onClick={() => setIsAdmin(false)} className="flex items-center gap-3 px-8 py-3 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-100">
              <LogOut size={12} /> Logout Admin
            </button>
          )}
        </div>
        <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-black/10">TN — 2024</p>
      </footer>

      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {/* LOGIN */}
        {showLogin && (
          <motion.div 
            key="login-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xl p-6"
          >
            <motion.div 
              initial={{ y: 30 }} animate={{ y: 0 }}
              className="bg-white w-full max-w-xs rounded-sm p-12 shadow-2xl"
            >
              <h3 className="font-serif text-3xl mb-10 text-center italic">Accesso</h3>
              <input 
                type="password" 
                placeholder="Key"
                className="w-full h-12 border-b border-black outline-none mb-10 text-center text-sm font-bold tracking-[0.5em]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button 
                onClick={handleLogin} 
                className="w-full py-5 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                Accedi
              </button>
              <button 
                onClick={() => setShowLogin(false)} 
                className="w-full py-4 text-[9px] uppercase font-bold tracking-widest text-gray-300 mt-2"
              >
                Indietro
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* CAT MANAGER */}
        {showCatManager && (
          <CategoryManager 
            key="cat-manager-overlay"
            categories={menu} 
            onSave={(newCats) => {
              setMenu(newCats.map(nc => {
                const existing = menu.find(m => m.id === nc.id);
                return { ...nc, items: existing ? existing.items : [] };
              }));
              setShowCatManager(false);
            }} 
            onCancel={() => setShowCatManager(false)} 
          />
        )}

        {/* ITEM EDITOR */}
        {editingItem && (
          <motion.div 
            key="item-editor-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FCFAFA] overflow-y-auto no-scrollbar"
          >
            <div className="max-w-md mx-auto px-10 pt-20 pb-40">
              <div className="flex justify-between items-center mb-24">
                <h3 className="font-serif text-5xl italic">{editingItem.item ? 'Modifica' : 'Aggiungi'}</h3>
                <button onClick={() => setEditingItem(null)} className="p-4 bg-black text-white hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={saveItem} className="space-y-20">
                <div className="group border-b border-black/10 focus-within:border-black transition-colors">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Piatto</label>
                  <input name="name" defaultValue={editingItem.item?.name} required className="w-full text-4xl font-serif py-6 outline-none bg-transparent tracking-tighter" placeholder="es. Gnocchi freschi..." />
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="group border-b border-black/10 focus-within:border-black transition-colors">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Prezzo (€)</label>
                    <input name="price" defaultValue={editingItem.item?.price} required className="w-full text-2xl font-serif py-6 outline-none bg-transparent" placeholder="12,00" />
                  </div>
                  <div className="group border-b border-black/10 focus-within:border-black transition-colors relative">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Foto</label>
                    <div className="flex items-center gap-4 py-4">
                      <label 
                        htmlFor="image-upload" 
                        className="flex-1 py-4 px-4 bg-gray-50 border border-black/5 text-[9px] font-bold uppercase tracking-widest text-center cursor-pointer hover:bg-black hover:text-white transition-all overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        {editingItem.tempImage || editingItem.item?.image ? 'Foto Caricata ✓' : 'Carica dal PC'}
                      </label>
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingItem({ ...editingItem, tempImage: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="group border-b border-black/10 focus-within:border-black transition-colors">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Descrizione (ITA // ENG)</label>
                  <textarea 
                    name="description" 
                    defaultValue={editingItem.item?.description} 
                    required 
                    rows={4} 
                    className="w-full text-base font-light py-6 outline-none bg-transparent resize-none leading-relaxed" 
                    placeholder="Esempio: Pasta al pomodoro // Tomato pasta"
                  />
                  <p className="text-[9px] text-gray-300 mt-2 italic uppercase tracking-widest">Usa // per separare le lingue.</p>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#FCFAFA] via-[#FCFAFA] to-transparent">
                  <button type="submit" className="w-full py-8 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-4">
                    <Save size={20} /> Registra Piatto
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

