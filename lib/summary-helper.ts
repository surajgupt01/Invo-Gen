import { Prisma, InvoiceStatus } from "@prisma/client";

/**
 * Re-aggregates invoice telemetry for a specific user and upserts into InvoiceSummary.
 */
export async function refreshUserInvoiceSummary(
  tx: Prisma.TransactionClient,
  userId: string
) {
  // Aggregate stats directly from the invoice table for this user
  const aggregates = await tx.invoice.groupBy({
    by: ["paymentStatus"],
    where: { userId },
    _sum: { total: true },
    _count: { InvoiceId: true },
  });

  let totalPaid = new Prisma.Decimal(0);
  let totalOverdue = new Prisma.Decimal(0);
  let totalPending = new Prisma.Decimal(0);
  let totalCount = 0;
  let paidCount = 0;
  let overdueCount = 0;
  let pendingCount = 0;

  for (const item of aggregates) {
    const sumTotal = item._sum.total ?? new Prisma.Decimal(0);
    const count = item._count.InvoiceId ?? 0;

    totalCount += count;

    switch (item.paymentStatus) {
      case InvoiceStatus.PAID:
        totalPaid = totalPaid.add(sumTotal);
        paidCount += count;
        break;
      case InvoiceStatus.OVERDUE:
        totalOverdue = totalOverdue.add(sumTotal);
        overdueCount += count;
        break;
      case InvoiceStatus.PENDING:
        totalPending = totalPending.add(sumTotal);
        pendingCount += count;
        break;
      default:
        // DRAFT and CANCELLED statuses only increment totalCount
        break;
    }
  }

  // Atomically upsert summary record
  return await tx.invoiceSummary.upsert({
    where: { userId },
    create: {
      userId,
      totalPaid,
      totalOverdue,
      totalPending,
      totalCount,
      paidCount,
      overdueCount,
      pendingCount,
    },
    update: {
      totalPaid,
      totalOverdue,
      totalPending,
      totalCount,
      paidCount,
      overdueCount,
      pendingCount,
    },
  });
}