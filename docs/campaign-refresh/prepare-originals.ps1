Add-Type -AssemblyName System.Drawing
$campaignDir = Join-Path (Get-Location) 'frontend/public/images/campaigns'
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)
function Save-CampaignCrop($source, $name, $x, $y, $width, $height) {
  $image = [System.Drawing.Bitmap]::FromFile((Join-Path (Get-Location) $source))
  try {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $width, $height)
    $crop = $image.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try { $crop.Save((Join-Path $campaignDir $name), $jpegCodec, $encoderParams) } finally { $crop.Dispose() }
  } finally { $image.Dispose() }
}
function Save-CampaignOriginal($source, $name) {
  $image = [System.Drawing.Bitmap]::FromFile((Join-Path (Get-Location) $source))
  try { $image.Save((Join-Path $campaignDir $name), $jpegCodec, $encoderParams) } finally { $image.Dispose() }
}
# The supplied volleyball file is two finished designs separated by a white rule.
Save-CampaignCrop 'Play Outside Beach Volleyball Collection.png' 'volleyball-desktop.jpg' 0 0 1746 724
Save-CampaignCrop 'Play Outside Beach Volleyball Collection.png' 'volleyball-mobile.jpg' 1757 0 415 724
Save-CampaignOriginal 'ChatGPT Image Nov 10, 2026, 09_34_26 AM.png' 'surf-original.jpg'
Save-CampaignOriginal 'Poolside Model with Salt & Fade Tee.png' 'pool-original.jpg'
Save-CampaignOriginal 'frontend/public/images/tennis-courtside-hero.png' 'tennis-desktop.jpg'
Save-CampaignCrop 'frontend/public/images/tennis-courtside-hero.png' 'tennis-mobile.jpg' 768 0 768 1024
$encoderParams.Dispose()
