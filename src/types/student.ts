export interface AttendanceRecord {
  date: string;
  present: boolean;
}

export interface Student {
  id: number;
  name: string;
  attendance: AttendanceRecord[];
  observations: string[];
}
