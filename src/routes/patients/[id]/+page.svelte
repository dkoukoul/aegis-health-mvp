<!-- Patient Detail Page (Tabbed) -->
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import {
    patientUseCases,
    appointmentUseCases,
    medicationUseCases,
    healthRecordUseCases,
  } from '$lib/services';
  import { AppointmentStatus, HealthRecordType, type Patient, type Appointment, type Medication, type HealthRecord } from '$core';

  let patient = $state<Patient | null>(null);
  let appointments = $state<Appointment[]>([]);
  let medications = $state<Medication[]>([]);
  let records = $state<HealthRecord[]>([]);
  let activeTab = $state<'info' | 'appointments' | 'medications' | 'records'>('info');
  let editing = $state(false);
  let error = $state('');

  // Sub-forms
  let showApptForm = $state(false);
  let showMedForm = $state(false);
  let showRecordForm = $state(false);

  let apptForm = $state({ title: '', dateTime: '', duration: 30, status: AppointmentStatus.Scheduled as string, notes: '' });
  let medForm = $state({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', prescribedBy: '', notes: '' });
  let recordForm = $state({ type: HealthRecordType.Note as string, title: '', description: '', date: '' });

  const patientId = $derived($page.params.id ?? '');

  function getField(obj: Patient, field: string): string {
    return (obj as unknown as Record<string, string>)[field] ?? '';
  }

  onMount(() => load());

  function load() {
    patient = patientUseCases.getById(patientId);
    appointments = appointmentUseCases.getByPatientId(patientId);
    medications = medicationUseCases.getByPatientId(patientId);
    records = healthRecordUseCases.getByPatientId(patientId);
  }

  function savePatient() {
    if (!patient) return;
    try {
      patientUseCases.update(patient.id, patient.toPlain());
      editing = false;
      error = '';
      load();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Error';
    }
  }

  function createAppointment() {
    try {
      appointmentUseCases.create({
        patientId,
        title: apptForm.title,
        dateTime: apptForm.dateTime,
        duration: apptForm.duration,
        status: apptForm.status as AppointmentStatus,
        notes: apptForm.notes,
      });
      showApptForm = false;
      apptForm = { title: '', dateTime: '', duration: 30, status: AppointmentStatus.Scheduled, notes: '' };
      load();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Error';
    }
  }

  function createMedication() {
    try {
      medicationUseCases.create({
        patientId,
        name: medForm.name,
        dosage: medForm.dosage,
        frequency: medForm.frequency,
        startDate: medForm.startDate,
        endDate: medForm.endDate || undefined,
        prescribedBy: medForm.prescribedBy,
        notes: medForm.notes,
      });
      showMedForm = false;
      medForm = { name: '', dosage: '', frequency: '', startDate: '', endDate: '', prescribedBy: '', notes: '' };
      load();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Error';
    }
  }

  function createRecord() {
    try {
      healthRecordUseCases.create({
        patientId,
        type: recordForm.type as HealthRecordType,
        title: recordForm.title,
        description: recordForm.description,
        date: recordForm.date,
      });
      showRecordForm = false;
      recordForm = { type: HealthRecordType.Note, title: '', description: '', date: '' };
      load();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Error';
    }
  }

  function deleteAppointment(id: string) {
    if (confirm('Delete this appointment?')) { appointmentUseCases.delete(id); load(); }
  }
  function deleteMedication(id: string) {
    if (confirm('Delete this medication?')) { medicationUseCases.delete(id); load(); }
  }
  function deleteRecord(id: string) {
    if (confirm('Delete this record?')) { healthRecordUseCases.delete(id); load(); }
  }
</script>

{#if !patient}
  <div class="empty-state"><p>Patient not found</p><a href="/patients">← Back to patients</a></div>
{:else}
  <div class="detail-page">
    <div class="page-header">
      <a href="/patients" class="back-link">← Back</a>
      <h1 class="page-title">{patient.fullName}</h1>
      {#if patient.amka}<span class="amka-badge">ΑΜΚΑ: {patient.amka}</span>{/if}
    </div>

    {#if error}<div class="error-msg">{error}</div>{/if}

    <!-- Tabs -->
    <div class="tabs">
      {#each [
        { key: 'info', label: 'Info', icon: '📋' },
        { key: 'appointments', label: 'Appointments', icon: '📅' },
        { key: 'medications', label: 'Medications', icon: '💊' },
        { key: 'records', label: 'Records', icon: '🏥' },
      ] as tab}
        <button
          class="tab" class:active={activeTab === tab.key}
          onclick={() => activeTab = tab.key as typeof activeTab}
        >
          {tab.icon} {tab.label}
          {#if tab.key === 'appointments'}<span class="badge">{appointments.length}</span>{/if}
          {#if tab.key === 'medications'}<span class="badge">{medications.length}</span>{/if}
          {#if tab.key === 'records'}<span class="badge">{records.length}</span>{/if}
        </button>
      {/each}
    </div>

    <!-- Tab: Info -->
    {#if activeTab === 'info'}
      <div class="card">
        <div class="card-header">
          <h2>Patient Information</h2>
          <button class="btn btn-sm" onclick={() => editing = !editing}>{editing ? 'Cancel' : 'Edit'}</button>
        </div>
        <div class="info-grid">
          {#each [
            ['First Name', 'firstName'], ['Last Name', 'lastName'], ['Father\'s Name', 'fatherName'],
            ['ΑΜΚΑ', 'amka'], ['ΑΦΜ', 'afm'], ['Date of Birth', 'dateOfBirth'],
            ['Gender', 'gender'], ['Phone', 'phone'], ['Email', 'email'],
            ['Insurance', 'insuranceProvider'], ['Insurance #', 'insuranceNumber'],
            ['Address', 'address'], ['City', 'city'], ['Postal Code', 'postalCode'],
          ] as [label, field]}
            <div class="info-item">
              <span class="info-label">{label}</span>
              {#if editing}
                <input class="info-input" bind:value={patient[field as keyof Patient]} />
              {:else}
                <span class="info-value">{getField(patient, field) || '—'}</span>
              {/if}
            </div>
          {/each}
        </div>
        {#if editing}
          <div class="form-actions">
            <button class="btn btn-primary" onclick={savePatient}>Save Changes</button>
          </div>
        {/if}
      </div>

    <!-- Tab: Appointments -->
    {:else if activeTab === 'appointments'}
      <div class="card">
        <div class="card-header">
          <h2>Appointments</h2>
          <button class="btn btn-sm btn-primary" onclick={() => showApptForm = !showApptForm}>
            {showApptForm ? 'Cancel' : '+ Add'}
          </button>
        </div>
        {#if showApptForm}
          <form class="inline-form" onsubmit={(e) => { e.preventDefault(); createAppointment(); }}>
            <input placeholder="Title" bind:value={apptForm.title} required />
            <input type="datetime-local" bind:value={apptForm.dateTime} required />
            <input type="number" placeholder="Minutes" bind:value={apptForm.duration} min="5" />
            <select bind:value={apptForm.status}>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button type="submit" class="btn btn-primary btn-sm">Create</button>
          </form>
        {/if}
        {#if appointments.length === 0}
          <p class="empty-text">No appointments</p>
        {:else}
          {#each appointments as appt}
            <div class="list-item">
              <div class="list-main">
                <strong>{appt.title}</strong>
                <span class="list-meta">
                  {new Date(appt.dateTime).toLocaleDateString('el-GR')} {new Date(appt.dateTime).toLocaleTimeString('el-GR', {hour:'2-digit',minute:'2-digit'})}
                  · {appt.duration} min
                </span>
              </div>
              <span class="status-pill status-{appt.status}">{appt.status}</span>
              <button class="btn btn-sm btn-danger" onclick={() => deleteAppointment(appt.id)}>✕</button>
            </div>
          {/each}
        {/if}
      </div>

    <!-- Tab: Medications -->
    {:else if activeTab === 'medications'}
      <div class="card">
        <div class="card-header">
          <h2>Medications</h2>
          <button class="btn btn-sm btn-primary" onclick={() => showMedForm = !showMedForm}>
            {showMedForm ? 'Cancel' : '+ Add'}
          </button>
        </div>
        {#if showMedForm}
          <form class="inline-form" onsubmit={(e) => { e.preventDefault(); createMedication(); }}>
            <input placeholder="Drug name" bind:value={medForm.name} required />
            <input placeholder="Dosage" bind:value={medForm.dosage} required />
            <input placeholder="Frequency" bind:value={medForm.frequency} />
            <input type="date" bind:value={medForm.startDate} required />
            <input placeholder="Prescribed by" bind:value={medForm.prescribedBy} />
            <button type="submit" class="btn btn-primary btn-sm">Create</button>
          </form>
        {/if}
        {#if medications.length === 0}
          <p class="empty-text">No medications</p>
        {:else}
          {#each medications as med}
            <div class="list-item">
              <div class="list-main">
                <strong>{med.name}</strong> — {med.dosage}
                <span class="list-meta">{med.frequency} · Since {med.startDate}</span>
              </div>
              <span class="status-pill" class:active-med={med.isActive} class:inactive-med={!med.isActive}>
                {med.isActive ? 'Active' : 'Ended'}
              </span>
              <button class="btn btn-sm btn-danger" onclick={() => deleteMedication(med.id)}>✕</button>
            </div>
          {/each}
        {/if}
      </div>

    <!-- Tab: Records -->
    {:else if activeTab === 'records'}
      <div class="card">
        <div class="card-header">
          <h2>Health Records</h2>
          <button class="btn btn-sm btn-primary" onclick={() => showRecordForm = !showRecordForm}>
            {showRecordForm ? 'Cancel' : '+ Add'}
          </button>
        </div>
        {#if showRecordForm}
          <form class="inline-form" onsubmit={(e) => { e.preventDefault(); createRecord(); }}>
            <select bind:value={recordForm.type}>
              <option value="diagnosis">Diagnosis</option>
              <option value="lab-result">Lab Result</option>
              <option value="note">Note</option>
              <option value="procedure">Procedure</option>
              <option value="referral">Referral</option>
            </select>
            <input placeholder="Title" bind:value={recordForm.title} required />
            <input type="date" bind:value={recordForm.date} required />
            <button type="submit" class="btn btn-primary btn-sm">Create</button>
          </form>
          <textarea class="record-desc" placeholder="Description..." bind:value={recordForm.description} rows="3"></textarea>
        {/if}
        {#if records.length === 0}
          <p class="empty-text">No health records</p>
        {:else}
          {#each records as rec}
            <div class="list-item">
              <div class="list-main">
                <strong>{rec.title}</strong>
                <span class="list-meta">{rec.type} · {rec.date}</span>
                {#if rec.description}<p class="record-preview">{rec.description.slice(0, 120)}{rec.description.length > 120 ? '…' : ''}</p>{/if}
              </div>
              <button class="btn btn-sm btn-danger" onclick={() => deleteRecord(rec.id)}>✕</button>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .detail-page { max-width: 900px; }

  .page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .back-link { color: #71717a; font-size: 0.85rem; transition: color 0.2s; }
  .back-link:hover { color: #a5b4fc; }
  .page-title { font-size: 1.5rem; font-weight: 700; color: #f4f4f5; }
  .amka-badge { font-size: 0.8rem; background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 0.2rem 0.6rem; border-radius: 999px; font-family: monospace; }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem; }

  /* Tabs */
  .tabs { display: flex; gap: 2px; margin-bottom: 1.5rem; background: #18181b; border-radius: 10px; padding: 4px; border: 1px solid #27272a; }
  .tab { flex: 1; padding: 0.6rem; background: none; border: none; color: #71717a; cursor: pointer; border-radius: 8px; font-size: 0.8rem; font-weight: 500; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }
  .tab:hover { color: #d4d4d8; }
  .tab.active { background: #27272a; color: #e4e4e7; }
  .badge { font-size: 0.7rem; background: rgba(99,102,241,0.2); color: #a5b4fc; padding: 0.1rem 0.4rem; border-radius: 999px; }

  /* Card */
  .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 1.5rem; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .card-header h2 { font-size: 1rem; font-weight: 600; color: #d4d4d8; }

  /* Info grid */
  .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .info-item { display: flex; flex-direction: column; gap: 0.2rem; }
  .info-label { font-size: 0.75rem; color: #71717a; text-transform: uppercase; letter-spacing: 0.03em; }
  .info-value { font-size: 0.9rem; color: #d4d4d8; }
  .info-input { padding: 0.4rem 0.6rem; background: #0f1117; border: 1px solid #27272a; border-radius: 6px; color: #e4e4e7; font-size: 0.85rem; font-family: inherit; }
  .info-input:focus { outline: none; border-color: #6366f1; }

  /* Inline form */
  .inline-form { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; padding: 0.75rem; background: #0f1117; border-radius: 8px; }
  .inline-form input, .inline-form select { padding: 0.4rem 0.6rem; background: #18181b; border: 1px solid #27272a; border-radius: 6px; color: #e4e4e7; font-size: 0.8rem; font-family: inherit; }
  .inline-form input:focus, .inline-form select:focus { outline: none; border-color: #6366f1; }
  .record-desc { width: 100%; padding: 0.5rem 0.75rem; background: #0f1117; border: 1px solid #27272a; border-radius: 8px; color: #e4e4e7; font-size: 0.85rem; font-family: inherit; margin-bottom: 1rem; resize: vertical; }
  .record-desc:focus { outline: none; border-color: #6366f1; }

  /* List items */
  .list-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid #1e1e24; }
  .list-item:last-child { border-bottom: none; }
  .list-main { flex: 1; }
  .list-main strong { font-size: 0.9rem; color: #e4e4e7; }
  .list-meta { display: block; font-size: 0.75rem; color: #71717a; margin-top: 0.15rem; }
  .record-preview { font-size: 0.8rem; color: #a1a1aa; margin-top: 0.3rem; line-height: 1.4; }

  /* Status pills */
  .status-pill { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 500; white-space: nowrap; align-self: center; }
  .status-scheduled { background: rgba(99,102,241,0.15); color: #a5b4fc; }
  .status-completed { background: rgba(34,197,94,0.15); color: #86efac; }
  .status-cancelled { background: rgba(239,68,68,0.15); color: #fca5a5; }
  .active-med { background: rgba(34,197,94,0.15); color: #86efac; }
  .inactive-med { background: rgba(161,161,170,0.15); color: #a1a1aa; }

  .empty-text { color: #52525b; font-size: 0.85rem; padding: 1rem 0; }
  .form-actions { margin-top: 1rem; }

  /* Buttons */
  .btn { padding: 0.5rem 1rem; border-radius: 8px; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; font-family: inherit; transition: all 0.2s; }
  .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
  .btn-primary:hover { opacity: 0.9; }
  .btn-sm { padding: 0.3rem 0.6rem; font-size: 0.75rem; }
  .btn-danger { background: rgba(239,68,68,0.1); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }

  .empty-state { text-align: center; padding: 3rem; color: #71717a; }
  .empty-state a { color: #818cf8; }
</style>
