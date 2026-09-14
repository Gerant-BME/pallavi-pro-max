import { useSyncExternalStore } from "react";

export type Cylinder = {
  id: string;
  name: string;
  location: string;
  distributor: "Indane" | "HP Gas" | "Bharat Gas";
  percent: number;
  weightKg: number;
  capacityKg: number;
  daysLeft: number;
  battery: number;
  wifi: boolean;
  bluetooth: boolean;
  online: boolean;
  firmware: string;
  lastSync: string;
  leak: boolean;
};

export type AlertItem = {
  id: string;
  kind:
    | "low"
    | "critical"
    | "leak"
    | "battery"
    | "offline"
    | "sensor"
    | "calibration"
    | "refill"
    | "delivery";
  title: string;
  message: string;
  time: string;
  cylinderId: string;
  read: boolean;
};

export type Booking = {
  id: string;
  distributor: string;
  slot: string;
  address: string;
  status: "confirmed" | "dispatched" | "out-for-delivery" | "delivered";
  createdAt: string;
  price: number;
};

type State = {
  user: { name: string; email: string; phone: string; avatar: string } | null;
  cylinders: Cylinder[];
  alerts: AlertItem[];
  bookings: Booking[];
  emergency: boolean;
};

let state: State = {
  user: {
    name: "Sai Uma Pallavi Doku",
    email: "pallavi@pallavi.app",
    phone: "+91 74164 09890",
    avatar: "PP",
  },
  cylinders: [
    {
      id: "kitchen-01",
      name: "Kitchen Cylinder",
      location: "Home · Kitchen",
      distributor: "Indane",
      percent: 62,
      weightKg: 8.9,
      capacityKg: 14.2,
      daysLeft: 12,
      battery: 84,
      wifi: true,
      bluetooth: true,
      online: true,
      firmware: "2.4.1",
      lastSync: "2 min ago",
      leak: false,
    },
    {
      id: "backup-01",
      name: "Backup Cylinder",
      location: "Home · Balcony",
      distributor: "HP Gas",
      percent: 18,
      weightKg: 2.6,
      capacityKg: 14.2,
      daysLeft: 3,
      battery: 46,
      wifi: true,
      bluetooth: false,
      online: true,
      firmware: "2.4.1",
      lastSync: "5 min ago",
      leak: false,
    },
    {
      id: "cafe-01",
      name: "Cafe Line A",
      location: "Aroma Cafe · Bay 1",
      distributor: "Bharat Gas",
      percent: 74,
      weightKg: 14.7,
      capacityKg: 19.0,
      daysLeft: 8,
      battery: 91,
      wifi: true,
      bluetooth: true,
      online: true,
      firmware: "2.4.0",
      lastSync: "just now",
      leak: false,
    },
    {
      id: "terrace-01",
      name: "Terrace Cylinder",
      location: "Home · Terrace Grill",
      distributor: "Indane",
      percent: 45,
      weightKg: 6.4,
      capacityKg: 14.2,
      daysLeft: 6,
      battery: 72,
      wifi: false,
      bluetooth: true,
      online: true,
      firmware: "2.4.1",
      lastSync: "9 min ago",
      leak: false,
    },
  ],
  alerts: [
    { id: "a1", kind: "low", title: "Low LPG on Backup Cylinder", message: "Only 18% remaining — book a refill soon.", time: "12m", cylinderId: "backup-01", read: false },
    { id: "a2", kind: "delivery", title: "Refill dispatched", message: "Indane order #IN-8821 is on its way.", time: "1h", cylinderId: "kitchen-01", read: false },
    { id: "a3", kind: "battery", title: "Sensor battery low", message: "Backup Cylinder sensor at 46%.", time: "3h", cylinderId: "backup-01", read: true },
    { id: "a4", kind: "calibration", title: "Calibration recommended", message: "Cafe Line A last calibrated 45 days ago.", time: "1d", cylinderId: "cafe-01", read: true },
    { id: "a5", kind: "offline", title: "Device offline briefly", message: "Backup Cylinder reconnected in 3 min.", time: "2d", cylinderId: "backup-01", read: true },
  ],
  bookings: [
    { id: "b1", distributor: "Indane", slot: "Today · 4–6 PM", address: "12A Malkajgiri, Secunderabad", status: "out-for-delivery", createdAt: "Today, 09:14", price: 1105 },
    { id: "b2", distributor: "HP Gas", slot: "Nov 12 · 10 AM–12 PM", address: "12A Malkajgiri, Secunderabad", status: "delivered", createdAt: "Nov 12", price: 1088 },
  ],
  emergency: false,
};

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export const store = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  set: (updater: (s: State) => State) => { state = updater(state); emit(); },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(state), () => selector(state));
}

export const actions = {
  markAlertRead: (id: string) => store.set((s) => ({ ...s, alerts: s.alerts.map((a) => a.id === id ? { ...a, read: true } : a) })),
  markAllRead: () => store.set((s) => ({ ...s, alerts: s.alerts.map((a) => ({ ...a, read: true })) })),
  triggerLeak: (id: string) => store.set((s) => ({
    ...s,
    emergency: true,
    cylinders: s.cylinders.map((c) => c.id === id ? { ...c, leak: true } : c),
    alerts: [{ id: `leak-${Date.now()}`, kind: "leak", title: "GAS LEAK DETECTED", message: "Immediate action required. Follow safety steps.", time: "now", cylinderId: id, read: false }, ...s.alerts],
  })),
  clearEmergency: () => store.set((s) => ({
    ...s,
    emergency: false,
    cylinders: s.cylinders.map((c) => ({ ...c, leak: false })),
  })),
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => store.set((s) => {
    const booking: Booking = { ...b, id: `b${Date.now()}`, createdAt: "Just now", status: "confirmed" };
    return {
      ...s,
      bookings: [booking, ...s.bookings],
      alerts: [{ id: `bk-${Date.now()}`, kind: "refill", title: "Refill booked", message: `${b.distributor} — ${b.slot}`, time: "now", cylinderId: s.cylinders[0].id, read: false }, ...s.alerts],
    };
  }),
  simulateUsage: () => store.set((s) => ({
    ...s,
    cylinders: s.cylinders.map((c, i) => ({ ...c, percent: Math.max(0, c.percent - (i === 0 ? 1 : 0.4)), lastSync: "just now" })),
  })),
};

export const alertMeta: Record<AlertItem["kind"], { color: string; label: string }> = {
  low: { color: "warn", label: "Low LPG" },
  critical: { color: "danger", label: "Critical" },
  leak: { color: "danger", label: "Gas Leak" },
  battery: { color: "warn", label: "Battery" },
  offline: { color: "default", label: "Offline" },
  sensor: { color: "warn", label: "Sensor" },
  calibration: { color: "primary", label: "Calibration" },
  refill: { color: "success", label: "Refill" },
  delivery: { color: "primary", label: "Delivery" },
};