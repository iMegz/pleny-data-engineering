import { z } from 'zod';

const schema = z.object({
  brandName: z.string().trim(),
  yearFounded: z.number().int().min(1600).max(new Date().getFullYear()),
  headquarters: z.string().trim(),
  numberOfLocations: z.number().int().min(1),
});

export type BrandSchema = z.infer<typeof schema>;

export default schema;
