import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canSubmitReport } from "@/lib/rbac";
import { generateUploadSasUrl } from "@/lib/blob";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !canSubmitReport(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { filename } = body;

  if (!filename || typeof filename !== "string") {
    return NextResponse.json(
      { error: "Filename required" },
      { status: 400 }
    );
  }

  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const blobName = `reports/${session.user.id}/${Date.now()}-${sanitized}`;

  const result = await generateUploadSasUrl(blobName);

  if (!result) {
    return NextResponse.json(
      { error: "Azure Blob Storage not configured" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    uploadUrl: result.url,
    blobUrl: result.blobUrl,
  });
}
