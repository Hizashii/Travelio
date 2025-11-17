import { supabase } from '../lib/supabase'

const STORAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'destination-images'

/**
 * Upload an image file to Supabase Storage and return the public URL.
 */
export async function uploadDestinationImage(file: File): Promise<string> {
  const sanitizedName = file.name.replace(/\s+/g, '-').toLowerCase()
  const extension = sanitizedName.includes('.') ? '' : '.png'
  const fileName = `${Date.now()}-${sanitizedName}${extension}`
  const filePath = `destinations/${fileName}`

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/png',
    })

  if (error || !data) {
    console.error('Image upload failed:', error)
    throw error || new Error('Failed to upload image')
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)

  if (!publicUrlData?.publicUrl) {
    throw new Error('Failed to retrieve image URL')
  }

  return publicUrlData.publicUrl
}


