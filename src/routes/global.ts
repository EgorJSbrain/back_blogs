import { Router, Request, Response } from "express";
import { GlobalService } from "../services";
import { CodeResponseEnum } from "../constants/global";

export const globalRouter = Router({})

globalRouter.delete('/', async (req: Request, res: Response) => {
  const response = await GlobalService.deleteAll()

  if (!response) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.sendStatus(CodeResponseEnum.NO_CONTENT_204)
})