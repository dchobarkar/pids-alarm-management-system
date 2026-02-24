import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

const accountName = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_BLOB_CONTAINER || "investigation-photos";

function getCredential(): StorageSharedKeyCredential | null {
  if (!accountName || !accountKey) return null;
  return new StorageSharedKeyCredential(accountName, accountKey);
}

function getBlobServiceClient(): BlobServiceClient | null {
  const cred = getCredential();
  if (!cred) return null;
  return new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    cred
  );
}

export async function generateUploadSasUrl(
  blobName: string,
  expiresInMinutes = 60
): Promise<{ url: string; blobUrl: string } | null> {
  const client = getBlobServiceClient();
  const credential = getCredential();
  if (!client || !credential) return null;

  const container = client.getContainerClient(containerName);
  await container.createIfNotExists({ access: "blob" });

  const blobClient = container.getBlockBlobClient(blobName);
  const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const sasOptions = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("cw"),
    expiresOn,
    startsOn: new Date(),
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    credential
  ).toString();

  const sasUrl = `${blobClient.url}?${sasToken}`;
  const blobUrl = blobClient.url;

  return { url: sasUrl, blobUrl };
}

export function getBlobPublicUrl(blobName: string): string {
  if (!accountName) return "";
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
}
