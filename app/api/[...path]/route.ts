import app from '@sidekick-software/internship-backend/vercel';

export const GET = (request: Request) => app.fetch(request);

export const POST = GET;
export const PATCH = GET;
export const PUT = GET;
export const DELETE = GET;
