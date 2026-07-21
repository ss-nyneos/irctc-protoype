import type { PackageDetail, TourPackage } from "@/types";
import { formatINR } from "@/utils/format";
import { cancellationBands } from "@/data/policyContent";

export interface Faq {
  question: string;
  answer: string;
}

/**
 * The questions the tour desk actually fields, answered from the package's own
 * numbers rather than from boilerplate — the fare gap between classes, the real
 * boarding chain, this package's cancellation ladder. Generic FAQ copy is what
 * makes a help section read as filler; a traveller can tell the difference
 * between an answer about their tour and an answer about tours.
 */
export function buildFaqs(pkg: TourPackage, detail: PackageDetail): Faq[] {
  const cheapest = detail.classes[0];
  const dearest = detail.classes[detail.classes.length - 1];
  const boardingNames = detail.boarding.map((b) => b.station);

  const faqs: Faq[] = [
    {
      question: `What does the ${formatINR(pkg.price)} fare cover?`,
      answer: `It is the per-person ${cheapest.label} fare on twin sharing, and it covers ${pkg.inclusions
        .join(", ")
        .toLowerCase()}. GST at 5% is added at checkout. Not included: ${pkg.exclusions.join(", ").toLowerCase()}.`,
    },
    {
      question: "How do the classes differ?",
      answer: `${detail.classes
        .map((c) => `${c.label} (${c.code}) — ${c.detail.toLowerCase()}, ${formatINR(c.price)}`)
        .join("; ")}. The gap between ${cheapest.label} and ${dearest.label} works out to ${formatINR(
        dearest.price - cheapest.price,
      )} per person for the ${pkg.days} days.`,
    },
  ];

  if (boardingNames.length > 0) {
    faqs.push({
      question: "Can I board somewhere other than the origin?",
      answer: `Yes. This tour halts at ${boardingNames.join(
        ", ",
      )}, and you may join or leave at any of them at no change in fare — pick your halt in the Boarding panel before you pay. Timings are tentative and move with the running of the train, so reach the station 45 minutes early.`,
    });
  }

  faqs.push(
    {
      question: "Are children charged the full fare?",
      answer: `Children aged 5 to 11 travel at ${formatINR(
        cheapest.childPrice,
      )} in ${cheapest.label} sharing a berth with an adult. Over 11 pays adult fare and needs a berth of their own; under 5 travels free without one. Every traveller over 5 carries their own photo ID.`,
    },
    {
      question: "What happens if I cancel?",
      answer: `IRCTC withholds a share of the tour cost that grows as departure nears: ${cancellationBands
        .map((b) => `${b.label.toLowerCase()} out, ${b.flat !== undefined ? `${formatINR(b.flat)} per passenger` : `${b.percent}%`}`)
        .join("; ")}. The Cancellation & refund block under Terms prices each of those against your own booking. Refunds reach the original payment method within 7 to 10 working days.`,
    },
    {
      question: "Can I book for a group?",
      answer: `Groups of 10 or more are handled by the zonal office rather than online — they can hold a coach block, arrange a shared boarding point and quote a group fare on ${detail.code}. Use the numbers below, or leave a callback request and mention the group size.`,
    },
    {
      question: "When do I get my tickets?",
      answer: `A confirmation voucher reaches you by email and SMS as soon as payment clears. Berth numbers are allotted with the reservation chart and are emailed roughly four hours before departure, along with the coach position at ${
        detail.boarding[0]?.station ?? pkg.from
      }.`,
    },
  );

  return faqs;
}
