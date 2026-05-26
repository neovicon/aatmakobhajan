import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    
    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      const errorMsg = errors.map(e => `${e.field}: ${e.message}`).join(', ');
      throw new ApiError(400, `Validation Error: ${errorMsg}`, errors);
    }
    
    // Replace req.body with validated data (strips unknown fields)
    req.body = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};
