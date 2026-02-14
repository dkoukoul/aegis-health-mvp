
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { v4 as uuidv4 } from 'uuid';

/**
 * AEGIS HEALTH - Standalone Seed Script
 * Run with: bun scripts/seed.ts
 * 
 * This script connects to the running y-websocket server and 
 * populates it with dummy data for patients, appointments, 
 * medications, and health records.
 */

const WS_URL = process.env.PUBLIC_SYNC_SERVER_URL || 'ws://127.0.0.1:1234';
const ROOM_NAME = 'aegis-health';

const doc = new Y.Doc();
const wsProvider = new WebsocketProvider(WS_URL, ROOM_NAME, doc, { connect: true });

// Connection timeout to prevent infinite "connecting" loops
const connectionTimeout = setTimeout(() => {
  if (!wsProvider.shouldConnect || wsProvider.wsconnected === false) {
    console.error(`[Error] Could not connect to sync server at ${WS_URL} after 5 seconds.`);
    console.error('Make sure you have started the server with: npm run sync:server');
    process.exit(1);
  }
}, 5000);

wsProvider.on('status', (event: any) => {
  console.log(`[Seed] Connection status: ${event.status}`);
  if (event.status === 'connected') {
    clearTimeout(connectionTimeout);
    startSeeding();
  }
});

const GREEK_MALE_KEY_NAMES = ['Γιώργος', 'Δημήτρης', 'Γιάννης', 'Νίκος', 'Κώστας', 'Παναγιώτης', 'Βασίλης', 'Χρήστος', 'Θανάσης', 'Μιχάλης'];
const GREEK_FEMALE_KEY_NAMES = ['Μαρία', 'Ελένη', 'Κατερίνα', 'Δήμητρα', 'Σοφία', 'Γεωργία', 'Αναστασία', 'Ευαγγελία', 'Ιωάννα', 'Χριστίνα'];
const GREEK_LAST_NAMES = ['Παπαδόπουλος', 'Βλάχος', 'Γεωργίου', 'Οικονόμου', 'Δημητρίου', 'Μακρής', 'Παπαγεωργίου', 'Κωνσταντίνου', 'Δημόπουλος', 'Νικολάου', 'Καραγιάννης', 'Παππάς'];

const MEDICATION_NAMES = ['Metformin', 'Amoxicillin', 'Lipitor', 'Aspirin', 'Nexium', 'Ventolin', 'Paracetamol', 'Ibuprofen', 'Zoloft', 'Xanax'];
const DOSAGES = ['500mg', '1g', '10mg', '100mg', '20mg', '40mg', '5mg', '2.5mg'];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Before sleep', 'Every 8 hours', 'As needed'];

const HEALTH_RECORD_TEMPLATES = [
  { type: 'diagnosis', title: 'Essential Hypertension', description: 'Patient presents with consistently elevated blood pressure' },
  { type: 'diagnosis', title: 'Type 2 Diabetes', description: 'Elevated fasting glucose levels' },
  { type: 'lab-result', title: 'Complete Blood Count', description: 'All values within normal ranges except for slightly low iron' },
  { type: 'lab-result', title: 'Lipid Profile', description: 'Elevated LDL cholesterol' },
  { type: 'note', title: 'Initial Consultation', description: 'Patient reports mild chest pain during exercise' },
  { type: 'procedure', title: 'Annual Physical Examination', description: 'Standard checkup performed, everything normal' },
  { type: 'referral', title: 'Cardiology Referral', description: 'Referred for stress test due to reporting chest pain' },
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

/**
 * Very basic transliteration for dummy emails
 */
function transliterate(text: string): string {
  const map: Record<string, string> = {
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o', 'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('');
}

async function startSeeding() {
  console.log('[Seed] Starting data generation...');

  const patientsMap = doc.getMap('patients');
  const appointmentsMap = doc.getMap('appointments');
  const medicationsMap = doc.getMap('medications');
  const recordsMap = doc.getMap('healthRecords');

  const now = new Date();

  // Generate 5 patients for the CLI script (quick seed)
  for (let i = 0; i < 5; i++) {
    const id = uuidv4();
    const isMale = Math.random() > 0.5;
    const firstName = isMale ? randomElement(GREEK_MALE_KEY_NAMES) : randomElement(GREEK_FEMALE_KEY_NAMES);
    const lastName = randomElement(GREEK_LAST_NAMES);
    
    let finalLastName = lastName;
    // Basic Greek female last name inflection
    if (!isMale) {
      if (lastName.endsWith('ος')) finalLastName = lastName.slice(0, -2) + 'ου';
      else if (lastName.endsWith('ης')) finalLastName = lastName.slice(0, -2) + 'η';
      else if (lastName.endsWith('ας')) finalLastName = lastName.slice(0, -1); // Παππάς -> Παππά
    }

    const pMap = new Y.Map<string>();
    const patientData = {
      id,
      firstName,
      lastName: finalLastName,
      fatherName: randomElement(GREEK_MALE_KEY_NAMES),
      amka: randomDigits(11),
      afm: randomDigits(9),
      dateOfBirth: randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)).split('T')[0],
      gender: isMale ? 'male' : 'female',
      phone: '69' + randomDigits(8),
      email: `${transliterate(firstName)}.${transliterate(finalLastName)}@dummy-health.gr`,
      address: 'Διεύθυνση 123',
      city: 'Αθήνα',
      postalCode: '10000',
      insuranceProvider: 'ΕΟΠΥΥ',
      insuranceNumber: randomDigits(10),
      notes: 'Στοιχεία από script προσομοίωσης',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    for (const [k, v] of Object.entries(patientData)) pMap.set(k, v);
    patientsMap.set(id, pMap);

    console.log(`[Seed] Created patient: ${firstName} ${finalLastName}`);

    // Appointments
    const numAppts = 2;
    for (let j = 0; j < numAppts; j++) {
      const apptId = uuidv4();
      const aMap = new Y.Map<string>();
      const apptData = {
        id: apptId,
        patientId: id,
        title: randomElement(['Checkup', 'Follow-up', 'Consultation']),
        dateTime: randomDate(new Date(now.getTime() - 7 * 24 * 3600 * 1000), new Date(now.getTime() + 7 * 24 * 3600 * 1000)),
        duration: '30',
        status: Math.random() > 0.5 ? 'scheduled' : 'completed',
        notes: 'Seed appointment',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      for (const [k, v] of Object.entries(apptData)) aMap.set(k, v);
      appointmentsMap.set(apptId, aMap);
    }

    // Medications
    const medId = uuidv4();
    const mMap = new Y.Map<string>();
    const medData = {
      id: medId,
      patientId: id,
      name: randomElement(MEDICATION_NAMES),
      dosage: randomElement(DOSAGES),
      frequency: randomElement(FREQUENCIES),
      startDate: now.toISOString().split('T')[0],
      prescribedBy: 'Dr. Seed',
      notes: 'Seed medication',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    for (const [k, v] of Object.entries(medData)) mMap.set(k, v);
    medicationsMap.set(medId, mMap);

    // Records
    const recId = uuidv4();
    const rMap = new Y.Map<string>();
    const template = randomElement(HEALTH_RECORD_TEMPLATES);
    const recData = {
      id: recId,
      patientId: id,
      type: template.type,
      title: template.title,
      description: template.description,
      date: now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    for (const [k, v] of Object.entries(recData)) rMap.set(k, v);
    recordsMap.set(recId, rMap);
  }

  console.log('[Seed] Seeding complete! Waiting for sync...');
  
  // Give it a moment to sync before closing
  setTimeout(() => {
    console.log('[Seed] Done. Exiting.');
    process.exit(0);
  }, 2000);
}
