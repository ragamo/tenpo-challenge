import axios from 'axios'
import type { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, _: NextFunction) => {
  const searchParams = new URLSearchParams(req.query as Record<string, string>)
  const request = await axios.get(
    `https://de1.api.radio-browser.info/json/stations/search?${searchParams.toString()}`,
  )

  res.json(request.data)
}
