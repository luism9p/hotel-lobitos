import { useCallback, useState } from 'react'
import DateRangePicker from '../ui/DateRangePicker.jsx'
import Dropdown from '../ui/Dropdown.jsx'

const ROOM_OPTIONS = [1, 2, 3, 4, 5]
const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

const WHATSAPP_NUMBER = '51974578082'

function formatDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

/**
 * Floating availability card on the hero's bottom edge. There's no booking
 * system behind this — every field just gets folded into a pre-formatted
 * WhatsApp message, so the only real logic here is validating check-in/
 * check-out before opening wa.me. Date selection itself is delegated to
 * DateRangePicker (react-day-picker), which reports back plain
 * 'YYYY-MM-DD' strings — everything below treats it exactly like the
 * native inputs it replaced.
 */
export default function AvailabilityWidget() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [rooms, setRooms] = useState('1')
  const [guests, setGuests] = useState('2')
  const [error, setError] = useState('')

  // useState setters are already reference-stable across renders, so an
  // empty dep array here is correct — this keeps `onChange`'s identity
  // stable too, which DateRangePicker's own memoized callbacks depend on.
  // Without this, AvailabilityWidget re-rendering for any reason (e.g. the
  // rooms/guests dropdowns) would cascade into new callback identities
  // all the way down into the calendar popover for no reason.
  const handleDateRangeChange = useCallback(({ checkIn: nextCheckIn, checkOut: nextCheckOut }) => {
    setCheckIn(nextCheckIn)
    setCheckOut(nextCheckOut)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) {
      setError('Selecciona la fecha de check-in y check-out para continuar.')
      return
    }
    if (checkOut <= checkIn) {
      setError('La fecha de check-out debe ser posterior al check-in.')
      return
    }
    setError('')
    const message = [
      'Hola! Quisiera consultar disponibilidad en Hotel Lobitos:',
      `Check-in: ${formatDate(checkIn)}`,
      `Check-out: ${formatDate(checkOut)}`,
      `Habitaciones: ${rooms}`,
      `Huéspedes: ${guests}`,
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
  }

  return (
    <div className="availability-widget-wrap">
      <form className="availability-widget" onSubmit={handleSubmit} noValidate>
        <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChange={handleDateRangeChange} />
        <Dropdown id="aw-rooms" label="Habitaciones" value={rooms} options={ROOM_OPTIONS} onChange={setRooms} />
        <Dropdown id="aw-guests" label="Huéspedes" value={guests} options={GUEST_OPTIONS} onChange={setGuests} />
        <button type="submit" className="aw-submit">Consultar por WhatsApp</button>
      </form>
      {error ? <p className="aw-error" role="alert">{error}</p> : null}
    </div>
  )
}
