import { useState } from 'react'
import { DateTime } from 'luxon'
import './VimsottariDasaTable.css'

const DASA_SEQUENCE = [
  { id: 'Ketu', abbr: 'Ke', years: 7 },
  { id: 'Venus', abbr: 'Ve', years: 20 },
  { id: 'Sun', abbr: 'Su', years: 6 },
  { id: 'Moon', abbr: 'Mo', years: 10 },
  { id: 'Mars', abbr: 'Ma', years: 7 },
  { id: 'Rahu', abbr: 'Ra', years: 18 },
  { id: 'Jupiter', abbr: 'Ju', years: 16 },
  { id: 'Saturn', abbr: 'Sa', years: 19 },
  { id: 'Mercury', abbr: 'Me', years: 17 },
]

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashara', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyestha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravan', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
]

const NAK_SPAN = 360 / 27
const TOTAL = 120

function formatDuration(years) {
  const totalDays = years * 365.25
  const y = Math.floor(totalDays / 365.25)
  const rem = totalDays - y * 365.25
  const m = Math.floor(rem / 30.4375)
  const d = Math.round(rem - m * 30.4375)
  return `${y}y ${m}m ${d}d`
}

function formatDate(iso) {
  if (!iso) return ''
  return DateTime.fromISO(iso).toFormat('dd-LL-yyyy')
}

function computeDasaPeriods(chartData) {
  const moon = chartData.bodies.find((b) => b.id === 'Moon')
  if (!moon) return null

  const moonLon = ((moon.longitude % 360) + 360) % 360
  const nakIndex = Math.floor(moonLon / NAK_SPAN) % 27
  const fraction = (moonLon % NAK_SPAN) / NAK_SPAN
  const firstAbbr = DASA_SEQUENCE[nakIndex % 9].abbr
  const startIdx = DASA_SEQUENCE.findIndex((d) => d.abbr === firstAbbr)

  const birthDT = chartData.meta?.date ? DateTime.fromISO(chartData.meta.date) : null
  const now = DateTime.now()

  const rows = []
  let elapsedDays = 0

  for (let i = 0; i < 9; i++) {
    const dasa = DASA_SEQUENCE[(startIdx + i) % 9]
    const years = i === 0 ? (1 - fraction) * dasa.years : dasa.years

    const startDT = birthDT ? birthDT.plus({ days: elapsedDays }) : null
    elapsedDays += years * 365.25
    const endDT = birthDT ? birthDT.plus({ days: elapsedDays }) : null

    const subs = []
    let subElapsed = 0
    for (let j = 0; j < 9; j++) {
      const sub = DASA_SEQUENCE[(startIdx + i + j) % 9]
      const subYears = (years * sub.years) / TOTAL
      const subStart = startDT ? startDT.plus({ days: subElapsed }) : null
      subElapsed += subYears * 365.25
      const subEnd = startDT ? startDT.plus({ days: subElapsed }) : null
      subs.push({
        abbr: sub.abbr,
        id: sub.id,
        years: subYears.toFixed(2),
        duration: formatDuration(subYears),
        start: subStart ? subStart.toISODate() : '',
        end: subEnd ? subEnd.toISODate() : '',
        children: [],
      })
    }

    rows.push({
      abbr: dasa.abbr,
      id: dasa.id,
      years: years.toFixed(2),
      duration: formatDuration(years),
      start: startDT ? startDT.toISODate() : '',
      end: endDT ? endDT.toISODate() : '',
      isCurrent: Boolean(startDT && endDT && now >= startDT && now <= endDT),
      children: subs,
    })
  }

  return {
    nakIndex,
    nakName: NAKSHATRA_NAMES[nakIndex],
    nakLord: firstAbbr,
    nodes: rows,
  }
}

function DasaTreeNode({ node, level, path, expanded, selectedPath, onToggle, onSelect }) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expanded.has(path)
  const isSelected = selectedPath === path

  const handleToggle = (e) => {
    e.stopPropagation()
    onToggle(path)
  }

  const handleSelect = () => {
    onSelect(path, node)
  }

  return (
    <div className="dasa-tree-depth">
      <div
        className={[
          'dasa-tree-row',
          isSelected ? 'dasa-tree-row-selected' : '',
          node.isCurrent ? 'dasa-tree-row-current' : '',
        ].filter(Boolean).join(' ')}
        style={{ marginLeft: level * 24 }}
        onClick={handleSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (isSelected) {
              handleToggle(e)
            } else {
              handleSelect()
            }
          }
        }}
        aria-expanded={isExpanded}
        aria-selected={isSelected}
      >
        {hasChildren ? (
        <button
          type="button"
          className={`dasa-expand-btn ${isExpanded ? 'dasa-expand-btn-expanded' : ''}`}
          onClick={handleToggle}
          aria-label={isExpanded ? `Collapse ${node.id}` : `Expand ${node.id}`}
        >
          <span className="dasa-expand-icon" aria-hidden="true">
            {isExpanded ? '−' : '+'}
          </span>
        </button>
        ) : (
          <span className="dasa-expand-spacer" aria-hidden="true" />
        )}
        <span className="dasa-node-planet">
          <span className="dasa-lord">{node.abbr}</span> {node.id}
        </span>
        <span className="dasa-node-dates" title={`${formatDate(node.start)} to ${formatDate(node.end)}`}>
          From {formatDate(node.start)} to {formatDate(node.end)}
        </span>
        {node.duration ? <span className="dasa-node-duration">({node.duration})</span> : null}
      </div>
      {hasChildren && isExpanded && (
        <div className="dasa-tree-children">
          {node.children.map((child, j) => {
            const childPath = `${path}-${j}`
            return (
              <DasaTreeNode
                key={childPath}
                node={child}
                level={level + 1}
                path={childPath}
                expanded={expanded}
                selectedPath={selectedPath}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function DasaDetails({ node }) {
  return (
    <div className="dasa-details">
      <div className="dasa-details-planet">
        <span className="dasa-lord dasa-details-lord">{node.abbr}</span> {node.id}
      </div>
      <p className="dasa-details-dates">From {formatDate(node.start)} to {formatDate(node.end)}</p>
      {node.duration ? <p className="dasa-details-duration">Duration: {node.duration}</p> : null}
      {node.years ? <p className="dasa-details-years">Period: {node.years} years</p> : null}
    </div>
  )
}

export default function VimsottariDasaTable({ chartData }) {
  const dasa = computeDasaPeriods(chartData)

  const [expanded, setExpanded] = useState(() => {
    const set_ = new Set()
    if (dasa) {
      const currentIdx = dasa.nodes.findIndex((n) => n.isCurrent)
      if (currentIdx >= 0) set_.add(String(currentIdx))
    }
    return set_
  })
  const [selectedPath, setSelectedPath] = useState(() => {
    if (!dasa) return ''
    const currentIdx = dasa.nodes.findIndex((n) => n.isCurrent)
    return String(currentIdx >= 0 ? currentIdx : 0)
  })
  const [selectedNode, setSelectedNode] = useState(() => (dasa ? dasa.nodes[0] : null))

  if (!dasa) return null

  const handleToggle = (path) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const handleSelect = (path, node) => {
    setSelectedPath(path)
    setSelectedNode(node)
  }

  return (
    <div className="dasa-master-detail">
      <div className="dasa-header">
        <span className="dasa-header-title">Vimshottari Dasha</span>
      </div>
      <p className="dasa-meta">
        Janma Nakshatra: <strong>{dasa.nakName}</strong> (lord {dasa.nakLord})
      </p>
      <div className="dasa-panels">
        <nav className="dasa-tree-panel" aria-label="Dasha periods">
          <div className="dasa-tree">
            {dasa.nodes.map((node, i) => (
              <DasaTreeNode
                key={String(i)}
                node={node}
                level={0}
                path={String(i)}
                expanded={expanded}
                selectedPath={selectedPath}
                onToggle={handleToggle}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </nav>
        <aside className="dasa-details-panel">
          <DasaDetails node={selectedNode} />
        </aside>
      </div>
      <p className="dasa-note">
        Expand a mahadasha to reveal its antardasha periods. Select any period to view its details.
      </p>
    </div>
  )
}
