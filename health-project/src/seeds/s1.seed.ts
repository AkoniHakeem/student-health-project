// scripts/seed.ts
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { StaffAssignment } from 'src/entities/staff-assignment.entity';
import { AppointmentsService } from 'src/modules/appointments/appointments.service';
import { HealthRecordService } from 'src/modules/health-record/health-record.service';
import { UsersService } from 'src/modules/users/users.service';
import { AppointmentStatus, UserRole } from 'src/lib/types';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersSvc = app.get(UsersService);
  const apptsSvc = app.get(AppointmentsService);
  const hrSvc    = app.get(HealthRecordService);
//   const sympSvc  = app.get(SymptomLogsService);
  const assignRepo = app.get<Repository<StaffAssignment>>(getRepositoryToken(StaffAssignment));

  // 1) Create an admin
  // console.log('Seeding Admin…');
  // await usersSvc.create({
  //   firstName: 'Zara',
  //   lastName:  'Admin',
  //   email:     'admin@school.io',
  //   password:  'Password1',   // <— plaintext; will be bcrypt-hashed internally
  //   role:      UserRole.ADMIN,
  // });

  // 2) Create clinic staff
  const staffNames = [
    { fn: 'Ada',   ln: 'Lovelace', email: 'ada@school.io',   pw: 'StaffPass1!' },
    { fn: 'Bob',   ln: 'Builder',  email: 'bob@school.io',   pw: 'StaffPass2!' },
    { fn: 'Carla', ln: 'Nurse',    email: 'carla@school.io', pw: 'StaffPass3!' },
  ];
  console.log('Seeding Staff…');
  const staff = [];
  for (const s of staffNames) {
    let u = await usersSvc.findByEmail(s.email);
    if (!u) {
      await usersSvc.create({
        firstName: s.fn,
        lastName:  s.ln,
        email:     s.email,
        password:  s.pw,
        role:      UserRole.CLINIC_STAFF,
      });
      u = await usersSvc.findByEmail(s.email);
    }
    staff.push(u);
  }

  // 3) Create students
  console.log('Seeding Students…');
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const u = await usersSvc.findOne(i)
    students.push(u);
  }

  // 4) Assign 1–2 staff to each student
  // console.log('Seeding StaffAssignments…');
  // for (const student of students) {
  //   // pick a random staff
  //   const pick = staff[Math.floor(Math.random() * staff.length)];
  //   await assignRepo.save({ student, staff: pick });
  // }

  // 5) Create appointments
//   console.log('Seeding Appointments…');
  const now = DateTime.utc();
  // for (const student of students) {
  //   // two future appointments
  //   for (let j = 0; j < 2; j++) {
  //     const date = now.plus({ days: Math.ceil(Math.random() * 35) }).toISO();
  //     await apptsSvc.create(student, { date, staffId: staff[Math.floor(Math.random() * staff.length)].id });
  //   }
  //   // one past appointment, then approve it
  //   const pastDate = now.plus({ days: Math.ceil(Math.random() * 50) }).toISO();
  //   const appt = await apptsSvc.create(student, { date: pastDate });
  //   // find that student's assigned staff
  //   const asg = await assignRepo.findOne({ where: { student: { id: student.id } }, relations: ['staff'] });
  //   if (asg) {
  //     await apptsSvc.update(appt.id, asg.staff, {
  //       status:  AppointmentStatus.APPROVED,
  //       staffId: String(asg.staff.id),
  //     });
  //   }
  // }

  // 6) Add HealthRecordEntries for approved past appointments
  console.log('Seeding HealthRecordEntries…');
  const SAMPLE_NOTES = [
    'Routine checkup: all vitals normal.',
    'Complained of headache; prescribed rest.',
    'Follow-up on asthma; updated inhaler dosage.',
  ];
  const approvedAppts = await apptsSvc.findAll(
    { sub: 0, role: 'admin' } as any, // admin sees all
    1,
    1000,
  ).then(res => res.items.filter(a => a.status === 'approved'));
  for (const appt of approvedAppts) {
    if (appt.staff) {
      const note = SAMPLE_NOTES[Math.floor(Math.random() * SAMPLE_NOTES.length)];
      await hrSvc.addEntry(appt.id, appt.staff, note);
    }
  }

  // 7) Create SymptomLogs for each student
  console.log('Seeding SymptomLogs…');
  // const SAMPLE_SYMPTOMS = [
  //   'Headache and slight fever',
  //   'Stomach ache with nausea',
  //   'Sore throat and mild cough',
  // ];
  // for (const student of students) {
  //   for (let k = 0; k < 2; k++) {
  //     const input = SAMPLE_SYMPTOMS[Math.floor(Math.random() * SAMPLE_SYMPTOMS.length)];
  //     await sympSvc.createLog(student, { input });
  //   }
  // }

  console.log('✅ Seeding complete');
  await app.close();
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
