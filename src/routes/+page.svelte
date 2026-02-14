<!-- Dashboard Page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { appointmentUseCases, patientUseCases } from '$lib/services';
  import { t } from '$lib/i18n';
  import type { Appointment, Patient } from '$core';

  let todaysAppointments = $state<Appointment[]>([]);
  let recentPatients = $state<Patient[]>([]);
  let totalPatients = $state(0);
  let totalAppointments = $state(0);

  onMount(() => {
    loadDashboard();
  });

  function loadDashboard() {
    todaysAppointments = appointmentUseCases.getTodaysAppointments();
    const allPatients = patientUseCases.getAll();
    totalPatients = allPatients.length;
    totalAppointments = appointmentUseCases.getAll().length;
    recentPatients = allPatients.slice(0, 5);
  }
</script>

<div class="dashboard">
  <h1 class="page-title">{t('dashboard')}</h1>

  <!-- Stats cards -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">👥</div>
      <div class="stat-content">
        <span class="stat-value">{totalPatients}</span>
        <span class="stat-label">{t('patients')}</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📅</div>
      <div class="stat-content">
        <span class="stat-value">{todaysAppointments.length}</span>
        <span class="stat-label">Today's Appointments</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📋</div>
      <div class="stat-content">
        <span class="stat-value">{totalAppointments}</span>
        <span class="stat-label">{t('total_appointments')}</span>
      </div>
    </div>
  </div>

  <div class="dashboard-grid">
    <!-- Today's appointments -->
    <section class="card">
      <h2 class="card-title">📅 {t('todays_appointments')}</h2>
      {#if todaysAppointments.length === 0}
        <p class="empty-state">{t('no_appointments_today')}</p>
      {:else}
        <ul class="appointment-list">
          {#each todaysAppointments as appt}
            <li class="appointment-item">
              <span class="appt-time">
                {new Date(appt.dateTime).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span class="appt-title">{appt.title}</span>
              <span class="appt-status status-{appt.status}">{appt.status}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <!-- Recent patients -->
    <section class="card">
      <h2 class="card-title">👥 {t('recent_patients')}</h2>
      {#if recentPatients.length === 0}
        <p class="empty-state">{t('no_patients_yet')} — <a href="/patients">{t('add_first_patient')}</a></p>
      {:else}
        <ul class="patient-list">
          {#each recentPatients as patient}
            <li>
              <a href="/patients/{patient.id}" class="patient-link">
                <span class="patient-name">{patient.fullName}</span>
                {#if patient.amka}
                  <span class="patient-amka">ΑΜΚΑ: {patient.amka}</span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
        <a href="/patients" class="view-all-link">{t('view_all_patients')} →</a>
      {/if}
    </section>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-main);
  }

  /* Stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: border-color 0.2s;
  }

  .stat-card:hover {
    border-color: var(--accent);
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-main);
    display: block;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Dashboard grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  /* Card */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
  }

  .empty-state {
    color: var(--text-muted);
    font-size: 0.9rem;
    padding: 1rem 0;
  }

  .empty-state a {
    color: var(--accent);
    text-decoration: underline;
  }

  /* Appointment list */
  .appointment-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .appointment-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-input);
    border-radius: 8px;
    color: var(--text-main); /* Ensure text is visible */
  }

  .appt-time {
    font-weight: 600;
    color: var(--nav-active-text); /* Use accent or nav active text */
    font-size: 0.85rem;
    min-width: 50px;
  }

  .appt-title {
    flex: 1;
    font-size: 0.9rem;
  }

  .appt-status {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-weight: 500;
  }

  .status-scheduled { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
  .status-completed { background: rgba(34, 197, 94, 0.15); color: #86efac; }
  .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
  
  /* Adjust status colors for light mode if needed, but these might work okay or need variables. 
     For now, I will keep them as is or try to use vars if available. 
     The layout variables define --danger but not success. */

  /* Patient list */
  .patient-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .patient-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    transition: background 0.2s;
    color: var(--text-main);
  }

  .patient-link:hover {
    background: var(--bg-input);
  }

  .patient-name {
    font-weight: 500;
    font-size: 0.9rem;
  }

  .patient-amka {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .view-all-link {
    display: block;
    text-align: center;
    padding: 0.75rem;
    margin-top: 0.5rem;
    color: var(--accent);
    font-size: 0.85rem;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .view-all-link:hover {
    background: var(--bg-input);
  }
</style>
