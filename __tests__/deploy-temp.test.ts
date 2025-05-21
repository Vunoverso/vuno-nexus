// __tests__/deploy-temp.test.ts
import { createMocks } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../pages/api/deploy/temp'

describe('API Route /api/deploy/temp', () => {
  it('should return 405 for non-POST methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(405)
    const json = JSON.parse(res._getData())
    expect(json).toEqual({ error: 'Method not allowed' })
  })

  it('should return 400 if missing project or arquivos', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {}
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(400)
    const json = JSON.parse(res._getData())
    expect(json).toEqual({ error: 'Missing project or arquivos' })
  })

  // Optionally add more tests for valid payload, mocking fs and archiver
})
