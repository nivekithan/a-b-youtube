import { z } from "zod";

export const ZClientUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  pictureUrl: z.string(),
});

export type ClientUser = z.infer<typeof ZClientUserSchema>;

