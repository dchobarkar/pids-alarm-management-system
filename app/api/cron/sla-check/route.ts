import { NextResponse } from "next/server";

import { checkSlaBreaches } from "@/api/sla/sla.service";

/**
 * GET or POST /api/cron/sla-check
 * Call from cron (e.g. every 1–5 min) or Azure Function timer.
 * No auth in this stub; in production protect with secret header or Azure Function key.
 */
export async function GET() {
  return runSlaCheck();
}

export async function POST() {
  return runSlaCheck();
}

async function runSlaCheck() {
  try {
    const breached = await checkSlaBreaches();
    return NextResponse.json({
      ok: true,
      breached: breached.length,
      alarmIds: breached.map((b) => b.alarmId),
    });
  } catch (e) {
    console.error("[sla-check]", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "SLA check failed" },
      { status: 500 },
    );
  }
}
