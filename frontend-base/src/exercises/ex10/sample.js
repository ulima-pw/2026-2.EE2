export const SAMPLE_ROOMS = [
  { id: 1, name: "Sala A-101", building: "Edificio A", capacity: 6, hasProjector: true, hasWhiteboard: true },
  { id: 2, name: "Sala B-204", building: "Edificio B", capacity: 10, hasProjector: false, hasWhiteboard: true },
];
export const SAMPLE_SLOTS = Array.from({ length: 14 }, (_, i) => ({ hour: 8 + i, available: ![10, 11, 15].includes(8 + i) }));
export const SAMPLE_RESERVATIONS = [
  { code: "RSV-2026-0001", roomId: 1, studentCode: "20231234", date: "2026-11-20", startHour: 10, hours: 2, attendees: 4, status: "ACTIVE" },
  { code: "RSV-2026-0002", roomId: 2, studentCode: "20231234", date: "2026-11-18", startHour: 14, hours: 1, attendees: 2, status: "CANCELLED" },
];
