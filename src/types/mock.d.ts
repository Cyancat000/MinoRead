declare module '../../mock/index.js' {
  export interface MockResponse<T = any> {
    code: number
    data: T
  }
  export function getMockData(
    path: string,
    lag?: number,
    sucsess?: boolean
  ): Promise<MockResponse>
  export const mockData: any
  export const mockDataRaw: any
}
