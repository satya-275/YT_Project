import type { Request, Response, NextFunction } from "express";

export const validateUserFields = (options: { requireParamEmail?: boolean; name?: boolean; email?: boolean }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;

    /* validating required fields */
    if (options.name && (!name || typeof name !== "string")) {
      return res.status(400).json({ error: "Name is required and must be a string" });
    }

    if (options.email && (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email))) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    /* patch validation */
    if (!options.name && !options.email) {

      if (!name && !email) {
        return res.status(400).json({ error: "At least one field (name or email) must be provided" });
      }

      if (name && typeof name !== "string") {
        return res.status(400).json({ error: "Name must be a string if provided" });
      }

      if (email && (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email))) {
        return res.status(400).json({ error: "Email must be valid if provided" });
      }
    }

    if (options.requireParamEmail) {
      const paramEmail = req.params.email;
      if (!paramEmail || typeof paramEmail !== "string" || !/^\S+@\S+\.\S+$/.test(paramEmail)) {
        return res.status(400).json({ error: "Valid email must be provided in URL params" });
      }
    }

    next();
  };
};


export const validateEmailParam = (paramName = 'email') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const email = req.params[paramName];

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required in URL' });
    }

    next();
  };
};