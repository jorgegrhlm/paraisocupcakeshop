function Icon({ name, size = 24, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}

export default Icon