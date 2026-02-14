import { patientUseCases, appointmentUseCases } from '$lib/services';
import { AppointmentStatus, Gender } from '$core';
import { v4 as uuidv4 } from 'uuid';

const GREEK_MALE_KEY_NAMES = ['Giorgos', 'Dimitris', 'Giannis', 'Nikos', 'Kostas', 'Panagiotis', 'Vasilis', 'Christos', 'Thanasis', 'Michalis'];
const GREEK_FEMALE_KEY_NAMES = ['Maria', 'Eleni', 'Katerina', 'Dimitra', 'Sofia', 'Georgia', 'Anastasia', 'Evangelia', 'Ioanna', 'Christina'];
const GREEK_LAST_NAMES = ['Papadopoulos', 'Vlachos', 'Georgiou', 'Oikonomou', 'Dimitriou', 'Makris', 'Papageorgiou', 'Konstantinou', 'Dimopoulos', 'Nikolaou', 'Karagiannis', 'Papas'];

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

export async function seedDatabase() {
  console.log('Seeding database...');
  
  const patients = [];

  // Generate 20 patients
  for (let i = 0; i < 20; i++) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? Gender.Male : Gender.Female;
    const firstName = isMale ? randomElement(GREEK_MALE_KEY_NAMES) : randomElement(GREEK_FEMALE_KEY_NAMES);
    const lastName = randomElement(GREEK_LAST_NAMES);
    
    // Make last name matches gender roughly (simplification: add 'ou' or 'a' for female? No, just keep simple for MVP or manually map)
    // Actually for Greek names in English transliteration, usually 'Papadopoulos' -> 'Papadopoulou' but let's stick to base for now or simple heuristic
    let finalLastName = lastName;
    if (!isMale && lastName.endsWith('os')) {
       finalLastName = lastName.slice(0, -2) + 'ou';
    } else if (!isMale && lastName.endsWith('as')) {
       finalLastName = lastName.slice(0, -2) + 'ou';
    }

    const patient = patientUseCases.create({
      firstName,
      lastName: finalLastName,
      fatherName: randomElement(GREEK_MALE_KEY_NAMES),
      amka: randomDigits(11),
      afm: randomDigits(9),
      dateOfBirth: randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)).split('T')[0],
      gender,
      phone: '69' + randomDigits(8),
      email: `${firstName.toLowerCase()}.${finalLastName.toLowerCase()}@example.com`,
      address: 'Leoforos Kifisias 10',
      city: 'Athens',
      postalCode: '11526',
      insuranceProvider: 'EOPYY',
      insuranceNumber: randomDigits(10),
      notes: 'Generated dummy patient',
    });
    
    patients.push(patient);
  }

  // Generate appointments for these patients
  // Some valid recent/upcoming dates
  const now = new Date();
  
  for (const patient of patients) {
    // 1-3 appointments per patient
    const numAppts = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numAppts; j++) {
      // Random date within last month to next month
      const apptDate = new Date(now.getTime() + (Math.random() * 60 - 30) * 24 * 60 * 60 * 1000);
      
      let status = AppointmentStatus.Scheduled;
      if (apptDate < now) {
         status = Math.random() > 0.8 ? AppointmentStatus.Cancelled : AppointmentStatus.Completed;
      }
      
      appointmentUseCases.create({
        patientId: patient.id,
        title: randomElement(['General Checkup', 'Blood Test Results', 'Vaccination', 'Follow-up', 'Prescription Renewal']),
        dateTime: apptDate.toISOString(),
        duration: 30,
        status,
        notes: 'Generated dummy appointment'
      });
    }
  }
  
  console.log('Seeding complete.');
  alert('Database seeded with 20 patients and appointments!');
}
