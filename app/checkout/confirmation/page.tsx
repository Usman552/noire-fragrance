import type { Metadata } from "next";
import { ConfirmationView } from "@/components/checkout/ConfirmationView";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return <ConfirmationView />;
}
