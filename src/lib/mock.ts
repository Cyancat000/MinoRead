export interface MockResponse<T = any> {
  code: number
  data: T
}

// @ts-ignore
import { getMockData as rawGetMockData } from '../../mock/index.js'

export const getMockData: (
  path: string,
  lag?: number,
  sucsess?: boolean
) => Promise<MockResponse> = rawGetMockData

