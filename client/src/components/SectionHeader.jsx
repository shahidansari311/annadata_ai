import ScrollReveal from './ScrollReveal'
import './SectionHeader.css'

function SectionHeader({ tag, title, subtitle, tagIcon }) {
  return (
    <ScrollReveal>
      <div className="section-header">
        {tag && (
          <span className="section-tag">
            {tagIcon && tagIcon}
            {tag}
          </span>
        )}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </ScrollReveal>
  )
}

export default SectionHeader
