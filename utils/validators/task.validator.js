import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validator.middleware.js";





export const createTaskValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  check('desc')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters'),

  check('priority')
    .optional() 
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  check('status')
    .optional() 
    .isIn(['inprogress', 'waiting', 'finshed'])
    .withMessage('Status must be one of: inprogress, waiting, finshed'),

  check('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid due date format'),

    validatorMiddleware
];

export const updateTaskValidator = [
  check('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  check('desc')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters'),

  check('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  check('status')
    .optional()
    .isIn(['inprogress', 'waiting', 'finshed'])
    .withMessage('Status must be one of: inprogress, waiting, finshed'),

  check('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
    validatorMiddleware

];