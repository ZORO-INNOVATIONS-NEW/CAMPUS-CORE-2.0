import { Request, Response } from 'express';

// export function fallbackHandler(req: Request, res: Response) {
//   console.error("Fallback triggered:", {
//     route: req.originalUrl,
//     method: req.method,
//     time: new Date().toISOString()
//   });

//   res.status(404).json({
//     status: 'error',
//     message: 'The requested resource is not available. Please check the URL or contact support.'
//   });
// };


export default function fallbackHandler(req: Request, res: Response) {
  console.error("Fallback triggered:", {
    route: req.originalUrl,
    method: req.method,
    time: new Date().toISOString()
  });

  res.status(404).json({
    status: 'error',
    message: 'The requested resource is not available. Please check the URL or contact support.'
  });
}