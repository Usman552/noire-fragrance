export interface CheckoutFields {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;

export const emptyCheckout: CheckoutFields = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  notes: "",
};

/** Normalises a Pakistani mobile number to +923XXXXXXXXX, or null if invalid. */
export function normalizePkPhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "");
  let m = digits.match(/^(?:\+92|0092|92)(3\d{9})$/);
  if (m) return `+92${m[1]}`;
  m = digits.match(/^0(3\d{9})$/);
  if (m) return `+92${m[1]}`;
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCheckout(f: CheckoutFields): CheckoutErrors {
  const e: CheckoutErrors = {};
  const name = f.name.trim();
  if (!name) e.name = "Please enter your full name.";
  else if (name.length < 3) e.name = "Name looks too short.";
  else if (!/^[\p{L}][\p{L}\s.'-]+$/u.test(name)) e.name = "Use letters only.";

  if (!f.phone.trim()) e.phone = "Please enter a mobile number.";
  else if (!normalizePkPhone(f.phone)) e.phone = "Use a Pakistani mobile number, e.g. 0300 1234567.";

  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address.";

  const address = f.address.trim();
  if (!address) e.address = "Please enter a delivery address.";
  else if (address.length < 10) e.address = "Add house number, street and area.";

  if (!f.city.trim()) e.city = "Please choose a city.";

  if (f.notes.length > 300) e.notes = "Keep delivery notes under 300 characters.";
  return e;
}

export const PK_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Hyderabad",
  "Other",
] as const;
