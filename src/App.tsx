import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Category = { id: number; name: string; percentage: number; color: string }

const defaultCategories: Category[] = [
  { id: 1, name: 'Comida', percentage: 30, color: '#f47d5d' },
  { id: 2, name: 'Vivienda', percentage: 30, color: '#efb64d' },
  { id: 3, name: 'Ahorro', percentage: 20, color: '#4ea994' },
  { id: 4, name: 'Ocio', percentage: 10, color: '#6f83d9' },
]

const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

function App() {
  const [income, setIncome] = useState(() => Number(localStorage.getItem('visual-income')) || 2400)
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('visual-categories')
    return saved ? JSON.parse(saved) : defaultCategories
  })

  useEffect(() => {
    localStorage.setItem('visual-income', String(income))
    localStorage.setItem('visual-categories', JSON.stringify(categories))
  }, [income, categories])

  const allocatedPercentage = categories.reduce((total, category) => total + category.percentage, 0)
  const allocatedAmount = income * allocatedPercentage / 100
  const remainingAmount = income - allocatedAmount
  const chartStyle = useMemo(() => {
    let cursor = 0
    const parts = categories.map((category) => {
      const start = cursor
      cursor += category.percentage
      return `${category.color} ${start}% ${cursor}%`
    })
    if (allocatedPercentage < 100) parts.push(`#e9e5dc ${allocatedPercentage}% 100%`)
    return { background: `conic-gradient(${parts.join(', ')})` }
  }, [categories, allocatedPercentage])

  const updateCategory = (id: number, percentage: number) => {
    setCategories((current) => current.map((category) => category.id === id ? { ...category, percentage: Math.max(0, Math.min(100, percentage)) } : category))
  }
  const addCategory = () => setCategories((current) => [...current, { id: Date.now(), name: 'Nueva categoría', percentage: 0, color: '#b983c8' }])
  const deleteCategory = (id: number) => setCategories((current) => current.filter((category) => category.id !== id))

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand"><span className="brand-mark">+</span><span>Visual project</span></div><div className="month-label"><span className="status-dot" /> Presupuesto personal <strong>Noviembre 2026</strong></div><button className="avatar" type="button" aria-label="Abrir perfil">VP</button></header>
      <div className="content">
        <section className="intro"><div><p className="eyebrow">Tu dinero, con intención</p><h1>Organiza lo que ganas.</h1><p className="intro-copy">Divide tus ingresos en lo que importa y toma mejores decisiones cada mes.</p></div><label className="income-control"><span>Ingreso mensual</span><div className="money-input"><span>€</span><input type="number" min="0" value={income} onChange={(event) => setIncome(Number(event.target.value))} aria-label="Ingreso mensual" /></div></label></section>
        <section className="summary-grid" aria-label="Resumen del presupuesto"><article className="summary-card summary-main"><span className="card-label">Ingreso total</span><strong>{money.format(income)}</strong><span className="positive">↑ Este mes</span></article><article className="summary-card"><span className="card-label">Ya distribuido</span><strong>{money.format(allocatedAmount)}</strong><span className="muted">{allocatedPercentage}% de tu ingreso</span></article><article className="summary-card remaining"><span className="card-label">Sin asignar</span><strong>{money.format(remainingAmount)}</strong><span className={remainingAmount < 0 ? 'negative' : 'muted'}>{remainingAmount < 0 ? 'Te pasaste del límite' : 'Listo para asignar'}</span></article></section>
        <div className="workspace-grid"><section className="panel categories-panel"><div className="panel-heading"><div><p className="eyebrow">Distribución</p><h2>Tus categorías</h2></div><button className="add-button" type="button" onClick={addCategory}><span>+</span> Añadir</button></div><div className="category-list">{categories.map((category) => <div className="category-row" key={category.id}><span className="category-color" style={{ backgroundColor: category.color }} /><input className="category-name" value={category.name} onChange={(event) => setCategories((current) => current.map((item) => item.id === category.id ? { ...item, name: event.target.value } : item))} aria-label={`Nombre de ${category.name}`} /><input className="category-range" type="range" min="0" max="100" value={category.percentage} onChange={(event) => updateCategory(category.id, Number(event.target.value))} aria-label={`Porcentaje de ${category.name}`} /><div className="percent-input"><input type="number" min="0" max="100" value={category.percentage} onChange={(event) => updateCategory(category.id, Number(event.target.value))} aria-label={`Porcentaje numérico de ${category.name}`} /><span>%</span></div><strong className="category-amount">{money.format(income * category.percentage / 100)}</strong><button className="delete-button" type="button" onClick={() => deleteCategory(category.id)} aria-label={`Eliminar ${category.name}`}>×</button></div>)}</div><div className={`allocation-note ${allocatedPercentage > 100 ? 'over' : ''}`}><span>{allocatedPercentage > 100 ? '!' : '✓'}</span>{allocatedPercentage > 100 ? `Has asignado ${allocatedPercentage - 100}% de más. Ajusta tus categorías.` : allocatedPercentage === 100 ? 'Tu presupuesto está completamente distribuido.' : `Aún tienes ${100 - allocatedPercentage}% sin asignar.`}</div></section><aside className="panel overview-panel"><div className="panel-heading"><div><p className="eyebrow">Vista rápida</p><h2>Así se reparte</h2></div><span className="more">•••</span></div><div className="donut" style={chartStyle}><div className="donut-center"><strong>{allocatedPercentage}%</strong><span>asignado</span></div></div><div className="legend">{categories.map((category) => <div className="legend-item" key={category.id}><span className="category-color" style={{ backgroundColor: category.color }} /><span>{category.name}</span><strong>{category.percentage}%</strong></div>)}</div></aside></div>
        <footer className="footer-note"><span>◷</span> Tus cambios se guardan automáticamente en este dispositivo.</footer>
      </div>
    </main>
  )
}

export default App
