interface InHouseRxDesktopApi {
  readonly platform: 'darwin' | 'linux' | 'win32'
  getCompanionCapabilities(): Promise<unknown>
  transcribeWithCompanion(input: { name: string; type: string; bytes: ArrayBuffer }): Promise<unknown>
}

interface Window {
  readonly inHouseRxDesktop?: InHouseRxDesktopApi
}

