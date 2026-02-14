<!-- Calendar Page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { appointmentUseCases, patientUseCases } from '$lib/services';
  import type { Appointment } from '$core';

  let currentDate = $state(new Date());
  let view = $state<'month' | 'week'>('month');
  let appointments = $state<Appointment[]>([]);

  let year = $derived(currentDate.getFullYear());
  let month = $derived(currentDate.getMonth());
  let monthName = $derived(currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

  // Calendar grid
  let calendarDays = $derived(generateCalendarDays(year, month));

  onMount(() => loadAppointments());

  function loadAppointments() {
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    appointments = appointmentUseCases.getByDateRange(start, end);
  }

  function generateCalendarDays(y: number, m: number) {
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
    const days: { date: number; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(y, m, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      days.push({ date: d, isCurrentMonth: false, dateStr: '' });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: d, isCurrentMonth: true, dateStr });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: d, isCurrentMonth: false, dateStr: '' });
    }

    return days;
  }

  function getAppointmentsForDate(dateStr: string): Appointment[] {
    return appointments.filter((a) => a.dateTime.startsWith(dateStr));
  }

  function prevMonth() {
    currentDate = new Date(year, month - 1, 1);
    loadAppointments();
  }

  function nextMonth() {
    currentDate = new Date(year, month + 1, 1);
    loadAppointments();
  }

  function goToToday() {
    currentDate = new Date();
    loadAppointments();
  }

  function isToday(dateStr: string): boolean {
    return dateStr === new Date().toISOString().split('T')[0];
  }

  function getPatientName(patientId: string): string {
    const p = patientUseCases.getAll().find(pt => pt.id === patientId);
    return p ? p.fullName : 'Unknown';
  }
</script>

<div class="calendar-page">
  <div class="page-header">
    <h1 class="page-title">Calendar</h1>
    <div class="calendar-nav">
      <button class="btn btn-ghost" onclick={prevMonth}>◀</button>
      <button class="btn btn-ghost" onclick={goToToday}>Today</button>
      <span class="month-label">{monthName}</span>
      <button class="btn btn-ghost" onclick={nextMonth}>▶</button>
    </div>
  </div>

  <div class="calendar-grid">
    <!-- Day headers -->
    {#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day}
      <div class="day-header">{day}</div>
    {/each}

    <!-- Days -->
    {#each calendarDays as day}
      <div
        class="day-cell"
        class:other-month={!day.isCurrentMonth}
        class:today={day.isCurrentMonth && isToday(day.dateStr)}
      >
        <span class="day-number">{day.date}</span>
        {#if day.isCurrentMonth}
          {#each getAppointmentsForDate(day.dateStr) as appt}
            <a href="/patients/{appt.patientId}" class="cal-event status-{appt.status}">
              <span class="cal-time">
                {new Date(appt.dateTime).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span class="cal-title">{appt.title}</span>
            </a>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar-page { max-width: 1100px; }

  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
  .page-title { font-size: 1.75rem; font-weight: 700; background: linear-gradient(135deg, #e4e4e7, #a1a1aa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  .calendar-nav { display: flex; align-items: center; gap: 0.5rem; }
  .month-label { font-size: 1rem; font-weight: 600; color: #d4d4d8; min-width: 160px; text-align: center; }

  /* Grid */
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
  }

  .day-header {
    padding: 0.75rem;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #27272a;
  }

  .day-cell {
    min-height: 100px;
    padding: 0.5rem;
    border-bottom: 1px solid #1e1e24;
    border-right: 1px solid #1e1e24;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .day-cell:nth-child(7n + 7) { border-right: none; }

  .day-cell.other-month { opacity: 0.3; }

  .day-cell.today {
    background: rgba(99, 102, 241, 0.05);
  }

  .day-cell.today .day-number {
    background: #6366f1;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .day-number {
    font-size: 0.8rem;
    font-weight: 500;
    color: #a1a1aa;
    margin-bottom: 0.15rem;
  }

  /* Calendar events */
  .cal-event {
    display: flex;
    gap: 0.25rem;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    font-size: 0.7rem;
    line-height: 1.3;
    transition: opacity 0.2s;
    text-decoration: none;
    color: inherit;
  }

  .cal-event:hover { opacity: 0.8; }

  .cal-event.status-scheduled { background: rgba(99,102,241,0.15); color: #a5b4fc; }
  .cal-event.status-completed { background: rgba(34,197,94,0.15); color: #86efac; }
  .cal-event.status-cancelled { background: rgba(239,68,68,0.15); color: #fca5a5; }

  .cal-time { font-weight: 600; white-space: nowrap; }
  .cal-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Buttons */
  .btn { padding: 0.5rem 1rem; border-radius: 8px; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; font-family: inherit; transition: all 0.2s; }
  .btn-ghost { background: transparent; color: #a1a1aa; border: 1px solid #27272a; }
  .btn-ghost:hover { background: #27272a; color: #e4e4e7; }

  @media (max-width: 768px) {
    .day-cell { min-height: 60px; padding: 0.25rem; }
    .cal-event { font-size: 0.6rem; }
  }
</style>
