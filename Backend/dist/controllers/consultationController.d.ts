import type { Request, Response, NextFunction } from "express";
export declare const getQueue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getHistory: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createConsultation: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateExistingConsultation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDailyLog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=consultationController.d.ts.map