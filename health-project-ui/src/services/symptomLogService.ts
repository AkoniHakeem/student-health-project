// src/services/symptomLogService.ts
import { api } from 'boot/axios';
import { apiRoutes } from 'src/lib/constants/apiRoutes';

export interface SymptomLog {
  id: string;
  studentId: string;
  text: string;
  diagnosis: string;
  createdAt: string; // ISO
}

export default {
  /** Submit a new symptom log */
  async create(text: string) {
    return await api.post<SymptomLog>(apiRoutes.symptomLogs.base, { input: text });
  },

  /** Get all logs for the current student */
  async getForStudent(studentId: string) {
    debugger;
    return await api.get<SymptomLog[]>(apiRoutes.symptomLogs.forStudent(studentId));
  },

  /** (Optional) fetch by ID */
  // async getById(id: string) {
  //   return await api.get<SymptomLog>(apiRoutes.symptomLogs.byId(id));
  // },
};
