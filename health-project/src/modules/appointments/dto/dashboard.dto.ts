export class DashboardAppointmentsDto {
  completed: number;
  upcoming: number;
  missed: number;
}

export class VisitHistoryDto {
  month: string;   // e.g. "Mar", "Apr"
  count: number;
}

export class DashboardDto {
  appointments: DashboardAppointmentsDto;
  visitHistory: VisitHistoryDto[];
}
