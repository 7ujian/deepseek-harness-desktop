import { describe, expect, it } from 'vitest'

const RELEASE_ENV = {
  DSH_DESKTOP_APP_ID: 'com.deepseek.dsh-desktop',
  DSH_DESKTOP_AUTO_UPDATE_ENV: 'production',
} as Record<string, string>

const { createElectronBuilderConfig } = await (async () => {
  // The module's default export builds one configuration at import time.
  for (const [name, value] of Object.entries(RELEASE_ENV)) process.env[name] ??= value
  return import('../electron-builder.config.mjs')
})()

describe('electron-builder configuration', () => {
  it('unpacks the dsh runtime from app.asar for Linux targets', () => {
    expect(createElectronBuilderConfig(RELEASE_ENV, 'linux', 'x64').asarUnpack).toContain('**/dsh/**')
    expect(createElectronBuilderConfig(RELEASE_ENV, 'linux', 'arm64').asarUnpack).toContain('**/dsh/**')
  })

  it('keeps the dsh runtime inside app.asar on Windows targets', () => {
    const unsignedWindows = { ...RELEASE_ENV, DSH_DESKTOP_UNSIGNED: '1' }
    expect(createElectronBuilderConfig(unsignedWindows, 'win32', 'x64').asarUnpack).not.toContain('**/dsh/**')
  })
})
