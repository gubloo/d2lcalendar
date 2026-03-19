import { useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin    from '@fullcalendar/daygrid'
import listPlugin       from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

export default function CalendarView({ events, onEventClick, onDateClick }) {
  const calRef = useRef(null)

  function handleEventClick(info) {
    info.jsEvent.preventDefault()
    onEventClick({
      id:          info.event.id,
      title:       info.event.title,
      start:       info.event.start,
      end:         info.event.end,
      allDay:      info.event.allDay,
      source:      info.event.extendedProps.source,
      description: info.event.extendedProps.description,
      location:    info.event.extendedProps.location,
      color:       info.event.backgroundColor,
    })
  }

  function handleDateClick(info) {
    onDateClick(info.date)
  }

  // Custom render for events — add a subtle left glow bar
  function renderEventContent(arg) {
    const isD2l = arg.event.extendedProps.source === 'ical'
    return (
      <div className={`fc-event-inner ${isD2l ? 'ev-d2l' : 'ev-custom'}`}>
        {!arg.event.allDay && (
          <span className="fc-event-time-label">
            {arg.timeText}
          </span>
        )}
        <span className="fc-event-title-label">{arg.event.title}</span>
      </div>
    )
  }

  return (
    <div className="calendar-shell">
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left:   'prev,next today',
          center: 'title',
          right:  'dayGridMonth,dayGridWeek,listWeek',
        }}
        buttonText={{
          today:       'Today',
          month:       'Month',
          week:        'Week',
          listWeek:    'Agenda',
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        height="100%"
        dayMaxEvents={3}
        moreLinkContent={({ num }) => `+${num} more`}
        nowIndicator
        eventTimeFormat={{
          hour:   'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        // List view settings
        listDayFormat={{ weekday: 'long', month: 'long', day: 'numeric' }}
        listDaySideFormat={false}
        noEventsText="No events to show"
      />
    </div>
  )
}
