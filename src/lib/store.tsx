import { createContext, useContext, useState, type ReactNode } from "react";

export type Country = { code: string; name: string; city: string; flag: string; min: number; max: number };
export type Service = { id: string; name: string; popularity: number; base: number };
export type Sms = { id: string; code: string; body: string; at: string };
export type OwnedNumber = { id: string; phone: string; country: string; flag: string; service: string; price: number; boughtAt: string; texts: Sms[] };
export type Deposit = { id: string; amount: number; ref: string; at: string; status: "Successful" | "Pending" };

export const countries: Country[] = [
  { code: "NG", name: "Nigeria", city: "Lagos", flag: "🇳🇬", min: 250, max: 900 },
  { code: "US", name: "United States", city: "New York", flag: "🇺🇸", min: 600, max: 2400 },
  { code: "GB", name: "United Kingdom", city: "London", flag: "🇬🇧", min: 550, max: 2100 },
  { code: "GH", name: "Ghana", city: "Accra", flag: "🇬🇭", min: 300, max: 1100 },
  { code: "KE", name: "Kenya", city: "Nairobi", flag: "🇰🇪", min: 320, max: 1150 },
  { code: "ZA", name: "South Africa", city: "Johannesburg", flag: "🇿🇦", min: 400, max: 1500 },
  { code: "CA", name: "Canada", city: "Toronto", flag: "🇨🇦", min: 580, max: 2200 },
  { code: "DE", name: "Germany", city: "Berlin", flag: "🇩🇪", min: 620, max: 2300 },
  { code: "FR", name: "France", city: "Paris", flag: "🇫🇷", min: 600, max: 2250 },
  { code: "IN", name: "India", city: "Mumbai", flag: "🇮🇳", min: 280, max: 950 },
  { code: "BR", name: "Brazil", city: "São Paulo", flag: "🇧🇷", min: 350, max: 1300 },
  { code: "NL", name: "Netherlands", city: "Amsterdam", flag: "🇳🇱", min: 640, max: 2350 },
];
export const popularCountries = ["NG", "US", "GB", "GH"];

export const services: Service[] = [
  ["indeed", "Indeed", 7, 0.55], ["facebook", "Facebook", 13, 0.4], ["whatsapp", "WhatsApp", 16, 0.9],
  ["instagram", "Instagram", 14, 0.45], ["google", "Google", 15, 0.6], ["telegram", "Telegram", 12, 0.8],
  ["tiktok", "TikTok", 11, 0.35], ["x", "X", 9, 0.3], ["linkedin", "LinkedIn", 8, 0.5],
  ["amazon", "Amazon", 6, 0.65], ["apple", "Apple", 5, 0.85], ["microsoft", "Microsoft", 4, 0.55],
  ["uber", "Uber", 3, 0.25], ["netflix", "Netflix", 2, 0.2], ["discord", "Discord", 10, 0.3], ["snapchat", "Snapchat", 1, 0.15],
].map(([id, name, popularity, base]) => ({ id, name, popularity, base }) as Service);

export const priceFor = (c: Country, s: Service) => Math.round((c.min + (c.max - c.min) * s.base) / 10) * 10;
export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
export const getService = (id: string) => services.find((s) => s.id === id)!;
export const getCountry = (code: string) => countries.find((c) => c.code === code)!;

const now = Date.now();
const ago = (m: number) => new Date(now - m * 60000).toISOString();
const code6 = () => String(Math.floor(100000 + Math.random() * 900000));
const phoneFor = (c: string) => {
  const d = () => Math.floor(Math.random() * 10);
  const prefix: Record<string, string> = { NG: "+234 80", US: "+1 212", GB: "+44 7", GH: "+233 24" };
  return `${prefix[c] ?? "+00 1"}${d()} ${d()}${d()}${d()} ${d()}${d()}${d()}${d()}`;
};

const seed: OwnedNumber[] = [
  { id: "n1", phone: "+234 803 412 7790", country: "NG", flag: "🇳🇬", service: "whatsapp", price: 740, boughtAt: ago(300),
    texts: [{ id: "t1", code: "482913", body: "Your WhatsApp code: 482-913. Don't share this code.", at: ago(12) }] },
  { id: "n2", phone: "+1 212 555 0148", country: "US", flag: "🇺🇸", service: "google", price: 1680, boughtAt: ago(900),
    texts: [{ id: "t2", code: "G-551204", body: "G-551204 is your Google verification code.", at: ago(45) },
            { id: "t3", code: "G-090317", body: "G-090317 is your Google verification code.", at: ago(1500) }] },
  { id: "n3", phone: "+44 7700 900 214", country: "GB", flag: "🇬🇧", service: "indeed", price: 1450, boughtAt: ago(60), texts: [] },
];
const seedDeposits: Deposit[] = [
  { id: "d1", amount: 5000, ref: "PSK_8F2K19", at: ago(2000), status: "Successful" },
  { id: "d2", amount: 2000, ref: "PSK_3J7Q04", at: ago(4000), status: "Successful" },
];

type Store = {
  balance: number; numbers: OwnedNumber[]; deposits: Deposit[];
  deposit: (amount: number) => void;
  buy: (country: string, service: string, price: number) => string | null;
};
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(3130);
  const [numbers, setNumbers] = useState(seed);
  const [deposits, setDeposits] = useState(seedDeposits);
  const deposit = (amount: number) => {
    setBalance((b) => b + amount);
    setDeposits((d) => [{ id: crypto.randomUUID(), amount, ref: "PSK_" + Math.random().toString(36).slice(2, 8).toUpperCase(), at: new Date().toISOString(), status: "Successful" }, ...d]);
  };
  const buy = (country: string, service: string, price: number) => {
    if (price > balance) return null;
    const c = getCountry(country);
    const id = crypto.randomUUID();
    setBalance((b) => b - price);
    setNumbers((n) => [{ id, phone: phoneFor(country), country, flag: c.flag, service, price, boughtAt: new Date().toISOString(), texts: [] }, ...n]);
    setTimeout(() => {
      const code = code6();
      setNumbers((n) => n.map((x) => x.id === id ? { ...x, texts: [{ id: crypto.randomUUID(), code, body: `Your ${getService(service).name} verification code is ${code}.`, at: new Date().toISOString() }] } : x));
    }, 6000);
    return id;
  };
  return <Ctx.Provider value={{ balance, numbers, deposits, deposit, buy }}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx)!;

export const timeAgo = (iso: string) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
};
