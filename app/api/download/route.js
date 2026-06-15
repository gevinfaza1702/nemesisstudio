import { NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { Readable, PassThrough } from 'stream';

// Robust FFmpeg path resolution for Next.js environments
let ffmpegPath = ffmpegStatic;

// If we're in a dev environment or the static path fails, try to find it manually in node_modules
if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
  const manualPath = path.resolve(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
  if (fs.existsSync(manualPath)) {
    ffmpegPath = manualPath;
  }
}

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * DARKVERS PROMAX DOWNLOAD & BAKE PROXY
 * Server-side FFmpeg processing to bake CSS filters into the actual MP4 file.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'veo-video.mp4';
  const grade = searchParams.get('grade') || 'original';
  const vfxKeys = searchParams.get('vfx') ? searchParams.get('vfx').split(',') : [];

  if (!videoUrl) {
    return new NextResponse('Error: Missing video URL', { status: 400 });
  }

  try {
    // 1. Fetch the original video data fully
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Remote server storage error: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    if (videoBuffer.length === 0) {
      throw new Error('Received 0 bytes from video source');
    }

    // If 'original' AND NO VFX, just serve the buffer for maximum performance
    if (grade === 'original' && vfxKeys.length === 0) {
      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // 2. Prepare FFmpeg Filter Strings
    const ffmpegFilters = {
      'cyberpunk': 'eq=contrast=1.2:brightness=0.05:saturation=1.5,hue=h=-10',
      'noir': 'format=gray,eq=contrast=1.5:brightness=-0.1',
      'vintage': 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131,eq=saturation=0.8:contrast=0.9:brightness=0.1',
      'cold-thriller': 'hue=h=180,eq=saturation=0.6:contrast=1.1:brightness=-0.1',
      'golden-hour': 'eq=saturation=1.8:brightness=0.1:contrast=1.1',
      'emerald-matrix': 'hue=h=85,eq=contrast=1.1:brightness=0.1:saturation=1.5',
      'solar-flare': 'hue=h=-15,eq=contrast=1.5:brightness=0.2:saturation=2.0',
      'deep-abyss': 'hue=h=160,eq=contrast=1.2:brightness=-0.1:saturation=1.2',
      'anime-soul': 'eq=contrast=1.1:brightness=0.1:saturation=2.5',
      'sunset-blade': 'hue=h=-30,eq=contrast=1.1:brightness=0.05:saturation=1.5',
    };

    let activeVideoFilter = ffmpegFilters[grade] || 'copy';

    // 3. Handle VFX Overlays
    const vfxMappings = {
      'grain': 'noise=alls=12:allf=t+p',
      'vignette': 'vignette=angle=0.5',
      'rgb': 'rgbashift=rh=-3:bv=3',
      'vhs': 'noise=alls=20:allf=t+p,hue=s=0.5',
      'flare': 'curves=all=\'0/0 0.5/0.46 1/1\'',
    };

    vfxKeys.forEach(vfxKey => {
      const filter = vfxMappings[vfxKey];
      if (filter) {
        activeVideoFilter = activeVideoFilter === 'copy' ? filter : `${activeVideoFilter},${filter}`;
      }
    });



    // 4. Save to Temporary File
    const tempDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempInPath = path.join(tempDir, `input-${Date.now()}.mp4`);
    fs.writeFileSync(tempInPath, videoBuffer);

    const outputStream = new PassThrough();

    // Start FFmpeg processing from FILE
    const ff = ffmpeg(tempInPath)
      .videoFilter(activeVideoFilter)
      .format('mp4')
      .outputOptions([
        '-movflags frag_keyframe+empty_moov+default_base_moof',
        '-preset superfast',
        '-crf 23',
        '-c:a copy'
      ])
      .on('start', (cmd) => console.log('FFmpeg Hardcode Protocol Started:', cmd))
      .on('error', (err) => {
        console.error('FFmpeg Baking Error:', err.message);
        if (fs.existsSync(tempInPath)) fs.unlinkSync(tempInPath);
      })
      .on('end', () => {
        console.log('FFmpeg Hardcode Protocol Complete');
        if (fs.existsSync(tempInPath)) fs.unlinkSync(tempInPath);
      });

    ff.pipe(outputStream);

    // 5. Convert Node.js PassThrough stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        outputStream.on('data', (chunk) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        outputStream.on('end', () => {
          controller.close();
        });
        outputStream.on('error', (err) => {
          controller.error(err);
        });
      },
      cancel() {
        ff.kill();
        outputStream.destroy();
        if (fs.existsSync(tempInPath)) fs.unlinkSync(tempInPath);
      }
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked'
      },
    });

  } catch (error) {
    console.error('Download Bake Protocol Failure:', error);
    return new NextResponse(`Error: FFmpeg baking failed - ${error.message}`, { status: 500 });
  }
}
