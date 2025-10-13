export const computeBlockStyle = (start, end) => {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)

  const startInMinutes = sh * 60 + sm
  const endInMinutes = eh * 60 + em

  // Kun bosh va oxir (masalan 04:00 dan 24:00 gacha)
  const dayStart = 4 * 60
  const dayEnd = 24 * 60
  const totalMinutes = dayEnd - dayStart

  // Oldingi top/height o‘rniga endi left/width ishlatamiz
  const leftPercent = ((startInMinutes - dayStart) / totalMinutes) * 100
  const widthPercent = ((endInMinutes - startInMinutes) / totalMinutes) * 100

  return {
    position: 'absolute',
    top: '8px',
    bottom: '8px',
    left: `${leftPercent}%`,
    width: `${Math.max(widthPercent, 3)}%`, // minimal kenglik
    zIndex: 10,
  }
}
