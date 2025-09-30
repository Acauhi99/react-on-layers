import { z } from "zod";
import { toast } from "sonner";

export function useFormValidation() {
  const validateAndExecute = <T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    onSuccess: (validData: T) => void
  ) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return false;
    }

    onSuccess(result.data);
    return true;
  };

  return { validateAndExecute };
}
