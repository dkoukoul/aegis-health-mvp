<!-- Patients List Page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { patientUseCases } from '$lib/services';
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
    if (confirm('Are you sure you want to delete this patient?')) {
      patientUseCases.delete(id);
      loadPatients();
    }
  }
</script>

<div class="patients-page">
  <div class="page-header">
    <h1 class="page-title">Patients</h1>
    <button class="btn btn-primary" onclick={() => { showForm = !showForm; if (!showForm) resetForm(); }}>
      {showForm ? '✕ Cancel' : '+ New Patient'}
    </button>
  </div>

  <!-- Search -->
  <div class="search-bar">
    <input
      type="text"
      placeholder="Search by name, ΑΜΚΑ, phone, ΑΦΜ…"
      bind:value={searchQuery}
      oninput={handleSearch}
      class="search-input"
    />
  </div>

  <!-- Create form -->
  {#if showForm}
    <div class="card form-card">
      <h2 class="card-title">New Patient</h2>
      {#if formError}
        <div class="error-msg">{formError}</div>
      {/if}
      <form onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input id="firstName" type="text" bind:value={form.firstName} required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input id="lastName" type="text" bind:value={form.lastName} required />
          </div>
          <div class="form-group">
            <label for="fatherName">Father's Name</label>
            <input id="fatherName" type="text" bind:value={form.fatherName} />
          </div>
          <div class="form-group">
            <label for="amka">ΑΜΚΑ (11 digits)</label>
            <input id="amka" type="text" bind:value={form.amka} maxlength="11" pattern="[0-9]*" />
          </div>
          <div class="form-group">
            <label for="afm">ΑΦΜ (9 digits)</label>
            <input id="afm" type="text" bind:value={form.afm} maxlength="9" pattern="[0-9]*" />
          </div>
          <div class="form-group">
            <label for="dob">Date of Birth *</label>
            <input id="dob" type="date" bind:value={form.dateOfBirth} required />
          </div>
          <div class="form-group">
            <label for="gender">Gender *</label>
            <select id="gender" bind:value={form.gender}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input id="phone" type="tel" bind:value={form.phone} />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" bind:value={form.email} />
          </div>
          <div class="form-group">
            <label for="insurance">Insurance Provider</label>
            <input id="insurance" type="text" bind:value={form.insuranceProvider} placeholder="e.g. ΕΟΠΥΥ" />
          </div>
          <div class="form-group">
            <label for="insuranceNum">Insurance Number</label>
            <input id="insuranceNum" type="text" bind:value={form.insuranceNumber} />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input id="address" type="text" bind:value={form.address} />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input id="city" type="text" bind:value={form.city} />
          </div>
          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input id="postalCode" type="text" bind:value={form.postalCode} />
          </div>
        </div>
        <div class="form-group full-width">
          <label for="notes">Notes</label>
          <textarea id="notes" bind:value={form.notes} rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create Patient</button>
          <button type="button" class="btn btn-ghost" onclick={() => { showForm = false; resetForm(); }}>Cancel</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Patient list -->
  <div class="patient-table">
    {#if patients.length === 0}
      <div class="empty-state">
        {#if searchQuery}
          <p>No patients match "{searchQuery}"</p>
        {:else}
          <p>No patients yet. Click <strong>+ New Patient</strong> to add one.</p>
        {/if}
      </div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ΑΜΚΑ</th>
            <th>Phone</th>
            <th>Insurance</th>
            <th>Actions</th>
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
                  <a href="/patients/{patient.id}" class="btn btn-sm">View</a>
                  <button class="btn btn-sm btn-danger" onclick={() => handleDelete(patient.id)}>Delete</button>
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
    background: linear-gradient(135deg, #e4e4e7, #a1a1aa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Search */
  .search-bar {
    margin-bottom: 1.5rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 10px;
    color: #e4e4e7;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #6366f1;
  }

  .search-input::placeholder {
    color: #52525b;
  }

  /* Form */
  .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 1.5rem; }
  .card-title { font-size: 1rem; font-weight: 600; color: #d4d4d8; margin-bottom: 1rem; }
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
    color: #a1a1aa;
    font-weight: 500;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem 0.75rem;
    background: #0f1117;
    border: 1px solid #27272a;
    border-radius: 8px;
    color: #e4e4e7;
    font-size: 0.85rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #6366f1;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .error-msg {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  /* Table */
  .patient-table {
    background: #18181b;
    border: 1px solid #27272a;
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
    color: #71717a;
    border-bottom: 1px solid #27272a;
    font-weight: 600;
  }

  td {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-bottom: 1px solid #1e1e24;
  }

  tr:hover td { background: rgba(99, 102, 241, 0.03); }

  .patient-name-link {
    color: #a5b4fc;
    font-weight: 500;
    transition: color 0.2s;
  }

  .patient-name-link:hover { color: #c7d2fe; }

  .mono { font-family: 'SF Mono', monospace; font-size: 0.8rem; color: #a1a1aa; }

  .actions { display: flex; gap: 0.5rem; }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: #71717a;
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
    color: #a1a1aa;
    border: 1px solid #27272a;
  }

  .btn-ghost:hover { background: #27272a; }

  .btn-sm { padding: 0.3rem 0.6rem; font-size: 0.75rem; }

  .btn-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .btn-danger:hover { background: rgba(239, 68, 68, 0.2); }
</style>
