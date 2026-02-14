<!-- Patients List Page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { patientUseCases } from '$lib/services';
  import { t } from '$lib/i18n';
  import { Gender } from '$core';
  import type { Patient, PatientProps } from '$core';

  let patients = $state<Patient[]>([]);
  let searchQuery = $state('');
  let showForm = $state(false);

  // Form state
  let form = $state<PatientProps>({
    firstName: '',
    lastName: '',
    fatherName: '',
    amka: '',
    afm: '',
    dateOfBirth: '',
    gender: Gender.Male,
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    insuranceProvider: '',
    insuranceNumber: '',
    notes: '',
  });

  let formError = $state('');

  onMount(() => {
    loadPatients();
  });

  function loadPatients() {
    patients = searchQuery
      ? patientUseCases.search(searchQuery)
      : patientUseCases.getAll();
  }

  function handleSearch() {
    loadPatients();
  }

  function resetForm() {
    form = {
      firstName: '',
      lastName: '',
      fatherName: '',
      amka: '',
      afm: '',
      dateOfBirth: '',
      gender: Gender.Male,
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      insuranceProvider: '',
      insuranceNumber: '',
      notes: '',
    };
    formError = '';
  }

  function handleCreate() {
    try {
      formError = '';
      patientUseCases.create(form);
      showForm = false;
      resetForm();
      loadPatients();
    } catch (e: unknown) {
      formError = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  function handleDelete(id: string) {
    if (confirm(t('confirm_delete'))) {
      patientUseCases.delete(id);
      loadPatients();
    }
  }
</script>

<div class="patients-page">
  <div class="page-header">
    <h1 class="page-title">{t('patients_title')}</h1>
    <button class="btn btn-primary" onclick={() => { showForm = !showForm; if (!showForm) resetForm(); }}>
      {showForm ? '✕ ' + t('cancel') : '+ ' + t('new_patient')}
    </button>
  </div>

  <!-- Search -->
  <div class="search-bar">
    <input
      type="text"
      placeholder={t('search_placeholder')}
      bind:value={searchQuery}
      oninput={handleSearch}
      class="search-input"
    />
  </div>

  <!-- Create form -->
  {#if showForm}
    <div class="card form-card">
      <h2 class="card-title">{t('new_patient')}</h2>
      {#if formError}
        <div class="error-msg">{formError}</div>
      {/if}
      <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName">{t('first_name')} *</label>
            <input id="firstName" type="text" bind:value={form.firstName} required />
          </div>
          <div class="form-group">
            <label for="lastName">{t('last_name')} *</label>
            <input id="lastName" type="text" bind:value={form.lastName} required />
          </div>
          <div class="form-group">
            <label for="fatherName">{t('fathers_name')}</label>
            <input id="fatherName" type="text" bind:value={form.fatherName} />
          </div>
          <div class="form-group">
            <label for="amka">{t('amka')} (11)</label>
            <input id="amka" type="text" bind:value={form.amka} maxlength="11" pattern="[0-9]*" />
          </div>
          <div class="form-group">
            <label for="afm">{t('afm')} (9)</label>
            <input id="afm" type="text" bind:value={form.afm} maxlength="9" pattern="[0-9]*" />
          </div>
          <div class="form-group">
            <label for="dob">{t('dob')} *</label>
            <input id="dob" type="date" bind:value={form.dateOfBirth} required />
          </div>
          <div class="form-group">
            <label for="gender">{t('gender')} *</label>
            <select id="gender" bind:value={form.gender}>
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="phone">{t('phone')}</label>
            <input id="phone" type="tel" bind:value={form.phone} />
          </div>
          <div class="form-group">
            <label for="email">{t('email')}</label>
            <input id="email" type="email" bind:value={form.email} />
          </div>
          <div class="form-group">
            <label for="insurance">{t('insurance_provider')}</label>
            <input id="insurance" type="text" bind:value={form.insuranceProvider} placeholder="e.g. ΕΟΠΥΥ" />
          </div>
          <div class="form-group">
            <label for="insuranceNum">{t('insurance_number')}</label>
            <input id="insuranceNum" type="text" bind:value={form.insuranceNumber} />
          </div>
          <div class="form-group">
            <label for="address">{t('address')}</label>
            <input id="address" type="text" bind:value={form.address} />
          </div>
          <div class="form-group">
            <label for="city">{t('city')}</label>
            <input id="city" type="text" bind:value={form.city} />
          </div>
          <div class="form-group">
            <label for="postalCode">{t('postal_code')}</label>
            <input id="postalCode" type="text" bind:value={form.postalCode} />
          </div>
        </div>
        <div class="form-group full-width">
          <label for="notes">{t('notes')}</label>
          <textarea id="notes" bind:value={form.notes} rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">{t('create_patient')}</button>
          <button type="button" class="btn btn-ghost" onclick={() => { showForm = false; resetForm(); }}>{t('cancel')}</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Patient list -->
  <div class="patient-table">
    {#if patients.length === 0}
      <div class="empty-state">
        {#if searchQuery}
          <p>{t('no_matches')} "{searchQuery}"</p>
        {:else}
          <p>{t('no_patients_yet')}</p>
        {/if}
      </div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>{t('table_name')}</th>
            <th>{t('table_amka')}</th>
            <th>{t('table_phone')}</th>
            <th>{t('table_insurance')}</th>
            <th>{t('table_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {#each patients as patient}
            <tr>
              <td>
                <a href="/patients/{patient.id}" class="patient-name-link">
                  {patient.fullName}
                </a>
              </td>
              <td class="mono">{patient.amka || '—'}</td>
              <td>{patient.phone || '—'}</td>
              <td>{patient.insuranceProvider || '—'}</td>
              <td>
                <div class="actions">
                  <a href="/patients/{patient.id}" class="btn btn-sm">{t('view')}</a>
                  <button class="btn btn-sm btn-danger" onclick={() => handleDelete(patient.id)}>{t('delete')}</button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .patients-page {
    max-width: 1200px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-main);
  }

  /* Search */
  .search-bar {
    margin-bottom: 1.5rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-main);
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  /* Form */
  .card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 12px; padding: 1.5rem; }
  .card-title { font-size: 1rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem; }
  .form-card { margin-bottom: 1.5rem; }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .form-group.full-width { grid-column: 1 / -1; }

  .form-group label {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem 0.75rem;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-main);
    font-size: 0.85rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .error-msg {
    background: var(--danger-bg);
    border: 1px solid var(--danger);
    color: var(--danger);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  /* Table */
  .patient-table {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 12px;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }

  td {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border);
    color: var(--text-main);
  }

  tr:hover td { background: var(--bg-main); }

  .patient-name-link {
    color: var(--accent);
    font-weight: 500;
    transition: color 0.2s;
  }

  .patient-name-link:hover { color: var(--nav-active-text); }

  .mono { font-family: 'SF Mono', monospace; font-size: 0.8rem; color: var(--text-muted); }

  .actions { display: flex; gap: 0.5rem; }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--text-muted);
  }

  /* Buttons */
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: inherit;
    transition: all 0.2s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
  }

  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .btn-ghost:hover { background: var(--bg-input); color: var(--text-main); }

  .btn-sm { padding: 0.3rem 0.6rem; font-size: 0.75rem; }

  .btn-danger {
    background: var(--danger-bg);
    color: var(--danger);
    border: 1px solid var(--danger);
  }

  .btn-danger:hover { background: rgba(239, 68, 68, 0.2); }
</style>
