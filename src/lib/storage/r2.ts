import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Cloudflare R2 Storage Adapter
 *
 * Provides:
 * - 10 GB Free Storage
 * - $0 Bandwidth / Egress Fees
 * - S3-compatible Presigned URLs (Upload & Download)
 */

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'studyhub-books'
const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN // optional, e.g. https://pub-xxx.r2.dev or books.yourdomain.com

let r2ClientInstance: S3Client | null = null

export function isR2Configured(): boolean {
  return Boolean(
    accountId &&
    accessKeyId &&
    secretAccessKey &&
    !accountId.includes('placeholder') &&
    !accessKeyId.includes('placeholder')
  )
}

export function getR2Client(): S3Client {
  if (!r2ClientInstance) {
    if (!isR2Configured()) {
      throw new Error('Cloudflare R2 is not configured. Please add R2 credentials to .env.local')
    }

    r2ClientInstance = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  }
  return r2ClientInstance
}

export function getR2BucketName(): string {
  return bucketName
}

/**
 * Generate a 60-minute presigned download/view URL for an R2 object
 */
export async function getR2SignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
  // If public domain is configured, can return public CDN URL directly
  if (publicDomain) {
    const base = publicDomain.endsWith('/') ? publicDomain.slice(0, -1) : publicDomain
    return `${base}/${key}`
  }

  const client = getR2Client()
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

/**
 * Generate a presigned direct-upload URL for large files (PDF/EPUB) up to 100MB+
 */
export async function getR2SignedUploadUrl(key: string, contentType: string, expiresInSeconds = 1800): Promise<string> {
  const client = getR2Client()
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

/**
 * Server-side upload of a Buffer / Uint8Array to R2
 */
export async function uploadBufferToR2(key: string, buffer: Buffer | Uint8Array, contentType: string): Promise<string> {
  const client = getR2Client()
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )
  return key
}

/**
 * Delete an object from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client()
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  )
}
