/**
 * High-performance audio transcoding utilities for Telephony (Exotel) <-> OpenAI Realtime.
 * Supports G.711 mu-law (PCMU) encoding/decoding and PCM16 sample conversions.
 */

// G.711 mu-law decoding table
const ULAW_TO_PCM = new Int16Array(256);
for (let i = 0; i < 256; i++) {
  let ulaw = ~i;
  const sign = ulaw & 0x80;
  const exponent = (ulaw >> 4) & 0x07;
  const mantissa = ulaw & 0x0f;
  let sample = ((mantissa << 3) + 0x84) << exponent;
  sample -= 0x84;
  ULAW_TO_PCM[i] = sign !== 0 ? -sample : sample;
}

// Convert mu-law Buffer to 16-bit Linear PCM Buffer
export function ulawToPcm16(ulawBuffer: Buffer): Buffer {
  const pcmBuffer = Buffer.alloc(ulawBuffer.length * 2);
  for (let i = 0; i < ulawBuffer.length; i++) {
    const sample = ULAW_TO_PCM[ulawBuffer[i]];
    pcmBuffer.writeInt16LE(sample, i * 2);
  }
  return pcmBuffer;
}

// Convert 16-bit Linear PCM sample to mu-law byte
function linearToUlawSample(sample: number): number {
  const BIAS = 0x84;
  const CLIP = 32635;

  let sign = (sample >> 8) & 0x80;
  if (sign !== 0) sample = -sample;
  if (sample > CLIP) sample = CLIP;
  sample += BIAS;

  let exponent = 7;
  for (let expMask = 0x4000; (sample & expMask) === 0 && exponent > 0; expMask >>= 1) {
    exponent--;
  }

  const mantissa = (sample >> (exponent + 3)) & 0x0f;
  const ulawByte = ~(sign | (exponent << 4) | mantissa);
  return ulawByte & 0xff;
}

// Convert 16-bit Linear PCM Buffer to mu-law Buffer
export function pcm16ToUlaw(pcmBuffer: Buffer): Buffer {
  const samplesCount = Math.floor(pcmBuffer.length / 2);
  const ulawBuffer = Buffer.alloc(samplesCount);

  for (let i = 0; i < samplesCount; i++) {
    const sample = pcmBuffer.readInt16LE(i * 2);
    ulawBuffer[i] = linearToUlawSample(sample);
  }
  return ulawBuffer;
}

/**
 * Resamples 16-bit PCM buffer between sample rates (e.g. 24000 <-> 8000).
 */
export function resamplePcm16(
  inputBuffer: Buffer,
  fromSampleRate: number,
  toSampleRate: number
): Buffer {
  if (fromSampleRate === toSampleRate) return inputBuffer;

  const inSamples = Math.floor(inputBuffer.length / 2);
  const ratio = toSampleRate / fromSampleRate;
  const outSamples = Math.floor(inSamples * ratio);
  const outBuffer = Buffer.alloc(outSamples * 2);

  for (let i = 0; i < outSamples; i++) {
    const srcIndex = i / ratio;
    const indexFloor = Math.floor(srcIndex);
    const indexCeil = Math.min(inSamples - 1, Math.ceil(srcIndex));
    const fraction = srcIndex - indexFloor;

    const s1 = inputBuffer.readInt16LE(indexFloor * 2);
    const s2 = inputBuffer.readInt16LE(indexCeil * 2);
    const interpolated = Math.round(s1 + (s2 - s1) * fraction);

    outBuffer.writeInt16LE(Math.max(-32768, Math.min(32767, interpolated)), i * 2);
  }

  return outBuffer;
}
