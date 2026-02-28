/** User seed row. supervisorEmail references another user's email. */
export const SEED_USERS = [
  {
    name: "PIDS Operator",
    email: "operator@pids.com",
    role: "OPERATOR" as const,
  },
  {
    name: "Supervisor 1",
    email: "supervisor1@pids.com",
    role: "SUPERVISOR" as const,
  },
  {
    name: "RMP Alpha",
    email: "rmp1@pids.com",
    role: "RMP" as const,
    supervisorEmail: "supervisor1@pids.com",
  },
  {
    name: "RMP Beta",
    email: "rmp2@pids.com",
    role: "RMP" as const,
    supervisorEmail: "supervisor1@pids.com",
  },
  {
    name: "Emergency Responder",
    email: "er@pids.com",
    role: "ER" as const,
    supervisorEmail: "supervisor1@pids.com",
  },
];

/** Chainage seed row. Label is used as key for mappings and alarms. */
export const SEED_CHAINAGES = [
  {
    label: "0-10",
    startKm: 0,
    endKm: 10,
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    label: "11-20",
    startKm: 11,
    endKm: 20,
    latitude: 19.2183,
    longitude: 72.9781,
  },
];

/** Which users are mapped to which chainages (by email and chainage label). */
export const SEED_CHAINAGE_USERS = [
  { userEmail: "supervisor1@pids.com", chainageLabel: "0-10" },
  { userEmail: "rmp1@pids.com", chainageLabel: "0-10" },
  { userEmail: "rmp2@pids.com", chainageLabel: "0-10" },
  { userEmail: "er@pids.com", chainageLabel: "11-20" },
];

/** Alarm seed row. createdByEmail and chainageLabel reference SEED_USERS / SEED_CHAINAGES. */
export const SEED_ALARMS = [
  {
    latitude: 19.08,
    longitude: 72.88,
    chainageValue: 5.234,
    chainageLabel: "0-10",
    alarmType: "VIBRATION" as const,
    criticality: "HIGH" as const,
    status: "ASSIGNED" as const,
    createdByEmail: "operator@pids.com",
  },
  {
    latitude: 19.09,
    longitude: 72.89,
    chainageValue: 7.891,
    chainageLabel: "0-10",
    alarmType: "DIGGING" as const,
    criticality: "CRITICAL" as const,
    status: "VERIFIED" as const,
    createdByEmail: "operator@pids.com",
  },
];

/** Assignment seed row. References by creator email (alarm index) and user emails. */
export const SEED_ASSIGNMENTS = [
  {
    alarmIndex: 0,
    rmpEmail: "rmp1@pids.com",
    supervisorEmail: "supervisor1@pids.com",
    status: "ACCEPTED" as const,
    acceptedAt: true,
    completedAt: false,
  },
  {
    alarmIndex: 1,
    rmpEmail: "rmp2@pids.com",
    supervisorEmail: "supervisor1@pids.com",
    status: "COMPLETED" as const,
    acceptedAt: true,
    completedAt: true,
  },
];

/** Verification seed row. alarmIndex refers to SEED_ALARMS order. */
export const SEED_VERIFICATIONS = [
  {
    alarmIndex: 1,
    verifiedByEmail: "rmp2@pids.com",
    latitude: 19.0905,
    longitude: 72.8902,
    distance: 35,
    remarks: "Digging activity confirmed near pipeline",
    geoMismatch: false,
  },
];

/** Evidence seed row. alarmIndex and uploadedByEmail reference seeded data. */
export const SEED_EVIDENCE = [
  {
    alarmIndex: 1,
    uploadedByEmail: "rmp2@pids.com",
    fileUrl: "/uploads/alarms/alarm2/photo1.jpg",
    fileType: "image",
  },
];
