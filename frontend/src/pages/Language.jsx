import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Language() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [entries, setEntries] = useState([])
  const [langName, setLangName] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingEntry, setAddingEntry] = useState(false)
  const [f1, setF1] = useState(''); const [f2, setF2] = useState('')
  const [editingEntry, setEditingEntry] = useState(null)
  const [ef1, setEf1] = useState(''); const [ef2, setEf2] = useState('')
  const [addingCat, setAddingCat] = useState(false)
  const [catName, setCatName] = useState(''); const [catF1, setCatF1] = useState(''); const [catF2, setCatF2] = useState('')
  const [catError, setCatError] = useState('')

  useEffect(() => {
    api.get(`/api/categories?languageId=${id}`).then(r => {
      setCategories(r.data)
      if (r.data.length) setActiveCategory(r.data[0])
      setLoading(false)
    })
    api.get(`/api/languages`).then(r => {
      const lang = r.data.find(l => String(l.id) === String(id))
      if (lang) setLangName(lang.name)
    })
  }, [id])

  useEffect(() => {
    if (!activeCategory) return
    api.get(`/api/entries?categoryId=${activeCategory.id}`).then(r => setEntries(r.data))
  }, [activeCategory])

  async function addEntry(e) {
    e.preventDefault()
    if (!f1.trim() || !f2.trim()) return
    const { data } = await api.post(`/api/entries?categoryId=${activeCategory.id}`, { field1: f1.trim(), field2: f2.trim() })
    setEntries(prev => [data, ...prev])
    setF1(''); setF2(''); setAddingEntry(false)
  }

  async function saveEdit(e) {
    e.preventDefault()
    const { data } = await api.put(`/api/entries?id=${editingEntry.id}`, { field1: ef1, field2: ef2 })
    setEntries(prev => prev.map(en => en.id === data.id ? data : en))
    setEditingEntry(null)
  }

  async function deleteEntry(entryId) {
    await api.delete(`/api/entries?id=${entryId}`)
    setEntries(prev => prev.filter(en => en.id !== entryId))
  }

  async function addCustomCategory(e) {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/categories?languageId=${id}`, { name: catName, field1_label: catF1 || 'Term', field2_label: catF2 || 'Definition' })
      setCategories(prev => [...prev, data])
      setCatName(''); setCatF1(''); setCatF2(''); setAddingCat(false); setCatError('')
      setActiveCategory(data)
    } catch (err) { setCatError(err.response?.data?.error || 'Failed') }
  }

  async function deleteCategory(catId) {
    if (!confirm('Delete this category and all its entries?')) return
    await api.delete(`/api/categories?id=${catId}`)
    const remaining = categories.filter(c => c.id !== catId)
    setCategories(remaining)
    if (activeCategory?.id === catId) setActiveCategory(remaining[0] || null)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c]">
      <div className="w-7 h-7 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )

  const customCats = categories.filter(c => c.is_custom)

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] dark:bg-[#070f1c]">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-6">
          <Breadcrumbs extra={langName || 'Language'} />
          <button onClick={() => navigate('/revise')} className="px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 glow">
            Learn & Revise →
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">Categories</p>
            <div className="flex flex-col gap-0.5">
              {categories.map(c => (
                <div key={c.id} className="group flex items-center gap-1">
                  <button
                    onClick={() => { setActiveCategory(c); setAddingEntry(false) }}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory?.id === c.id ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-100 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                  >{c.name}</button>
                  {c.is_custom && (
                    <button onClick={() => deleteCategory(c.id)} className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-rose-500 transition-all text-xs rounded">✕</button>
                  )}
                </div>
              ))}
            </div>

            {customCats.length < 3 && !addingCat && (
              <button onClick={() => setAddingCat(true)} className="mt-3 w-full text-left px-3 py-2 rounded-lg text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors font-medium">
                + Custom category
              </button>
            )}

            {addingCat && (
              <form onSubmit={addCustomCategory} className="mt-3 p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] flex flex-col gap-2">
                <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Category name" className="input-sm" />
                <input value={catF1} onChange={e => setCatF1(e.target.value)} placeholder="Field 1 label" className="input-sm" />
                <input value={catF2} onChange={e => setCatF2(e.target.value)} placeholder="Field 2 label" className="input-sm" />
                {catError && <p className="text-xs text-rose-500">{catError}</p>}
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-1.5 rounded-lg bg-brand-gradient text-white text-xs font-semibold">Add</button>
                  <button type="button" onClick={() => setAddingCat(false)} className="flex-1 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs text-gray-500">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {activeCategory && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg">{activeCategory.name}</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</p>
                  </div>
                  {!addingEntry && (
                    <button onClick={() => setAddingEntry(true)} className="px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                      + Add entry
                    </button>
                  )}
                </div>

                {addingEntry && (
                  <form onSubmit={addEntry} className="mb-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c1a2e] flex gap-3 items-center shadow-sm">
                    <input autoFocus value={f1} onChange={e => setF1(e.target.value)} placeholder={activeCategory.field1_label} className="input-field flex-1" />
                    <input value={f2} onChange={e => setF2(e.target.value)} placeholder={activeCategory.field2_label} className="input-field flex-1" />
                    <button type="submit" className="px-3 py-2 rounded-lg bg-brand-gradient text-white text-sm font-semibold">Save</button>
                    <button type="button" onClick={() => { setAddingEntry(false); setF1(''); setF2('') }} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">✕</button>
                  </form>
                )}

                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] overflow-hidden bg-white dark:bg-[#0c1a2e]/40 shadow-sm">
                  <div className="grid grid-cols-2 px-5 py-3 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.08]">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{activeCategory.field1_label}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{activeCategory.field2_label}</p>
                  </div>
                  {entries.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No entries yet. Add your first one above.
                    </div>
                  ) : entries.map(en => (
                    <div key={en.id} className="group grid grid-cols-2 px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.05] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      {editingEntry?.id === en.id ? (
                        <form onSubmit={saveEdit} className="col-span-2 flex gap-3 items-center">
                          <input value={ef1} onChange={e => setEf1(e.target.value)} className="input-field flex-1" />
                          <input value={ef2} onChange={e => setEf2(e.target.value)} className="input-field flex-1" />
                          <button type="submit" className="px-3 py-1.5 rounded-lg bg-brand-gradient text-white text-xs font-semibold">Save</button>
                          <button type="button" onClick={() => setEditingEntry(null)} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs text-gray-400">✕</button>
                        </form>
                      ) : (
                        <>
                          <p className="text-sm text-gray-900 dark:text-white font-medium self-center">{en.field1}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{en.field2}</p>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                              <button onClick={() => { setEditingEntry(en); setEf1(en.field1); setEf2(en.field2) }} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors text-xs">✎</button>
                              <button onClick={() => deleteEntry(en.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-xs">✕</button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
