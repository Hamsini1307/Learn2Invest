# 📹 Video Placeholders — Beginner Level

Place your video files in this folder. The app will look for them at:

| Video File | Topic |
|---|---|
| `ppf.mp4` | What is PPF — Public Provident Fund |
| `fd.mp4` | Fixed Deposit — Safe & Steady Returns |
| `nsc.mp4` | NSC — National Savings Certificate |
| `ssy.mp4` | Sukanya Samriddhi Yojana |

## How to add videos:
1. Export your video as .mp4 (H.264)
2. Drop the file in this folder
3. The app will auto-pick it up via `localPath` in `src/data.js`

## Hosting externally?
Update the `videoUrl` field in `src/data.js` to point to your CDN/YouTube embed URL.

## Recommended video specs:
- Resolution: 1280×720 (720p)
- Format: MP4 (H.264)
- Duration: 4–8 minutes each
- File size: under 100MB per video
