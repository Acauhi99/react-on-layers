import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export abstract class BaseController {
  protected async handleRequest<T>(
    request: FastifyRequest,
    reply: FastifyReply,
    schema: z.ZodSchema<T>,
    handler: (data: T) => Promise<any>,
    successStatus: number = 200
  ): Promise<void> {
    try {
      const data = schema.parse(request.body);
      const result = await handler(data);
      reply.status(successStatus).send(result);
    } catch (error) {
      this.handleError(error, reply);
    }
  }

  protected handleError(error: unknown, reply: FastifyReply): void {
    if (error instanceof z.ZodError) {
      reply.status(400).send({
        error: "Validation error",
        details: error.issues,
      });
      return;
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = this.getErrorStatus(message);
    reply.status(status).send({ error: message });
  }

  private getErrorStatus(message: string): number {
    if (
      message.includes("Invalid credentials") ||
      message.includes("Invalid token")
    ) {
      return 401;
    }
    if (message.includes("already exists")) {
      return 409;
    }
    if (message.includes("not found")) {
      return 404;
    }
    return 400;
  }
}
