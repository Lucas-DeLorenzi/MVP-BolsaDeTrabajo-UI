import joi from "joi";
const today = new Date();
today.setHours(0, 0, 0, 0)
export const createInternshipSchema = joi.object({
  durationInMonths: joi
    .number()
    .integer()
    .greater(1)
    .less(13)
    .required()
    .messages({
    "number.greater": "Debe ser al menos 2 meses",
    "number.less": "Debe ser máximo 12 meses",
    "number.empty": "Este campo es obligatorio",
    "number.base": "Debe ser un número entero",
    "any.required": "Este campo es obligatorio",
  }),
  vacancies: joi
    .number()
    .integer()
    .greater(0)
    .less(1000)
    .required()
    .messages({
    "number.greater": "Mínimo 1 vacante",
    "number.less": "Máximo 1000 vacantes",
    "number.empty": "Este campo es obligatorio",
    "number.base": "Debe ingresar un número",
    "any.required": "Este campo es obligatorio",
  }),
  dateFrom: joi
  .date()
  .greater(today)
  .required()
  .messages({
    "date.base": "Debe ingresar una fecha",
    "date.greater": "Asigne una fecha posterior",
    "date.empty": "Este campo es obligatorio",
    "any.required": "Este campo es obligatorio",
  }),
  dateUntil: joi
  .date()
  .greater(joi.ref('dateFrom'))
  .required()
  .messages({
    "date.base": "Debe ingresar una fecha",
    "date.greater": "Asigne una fecha posterior",
    "date.empty": "Este campo es obligatorio",
    "any.required": "Este campo es obligatorio",
  }),
  startDate: joi
    .date()
    .greater(today)
    .required()
    .messages({
      "date.base": "Debe ingresar una fecha",
      "date.greater": "Asigne una fecha posterior",
      "date.empty": "Este campo es obligatorio",
      "any.required": "Este campo es obligatorio",
  }),
  searchTitle: joi
    .string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.min": "Debe contener al menos 3 caracteres",
      "string.max": "Debe contener como máximo 100 caracteres",
      "any.required": "Este campo es obligatorio",
      "string.empty": "Este campo es obligatorio",
  }),
  searchDescription: joi
    .string()
    .min(3)
    .max(1000)
    .required()
    .messages({
      "string.min": "Debe contener al menos 3 caracteres",
      "string.max": "Debe contener como máximo 1000 caracteres",
      "any.required": "Este campo es obligatorio",
      "string.empty": "Este campo es obligatorio",
    }),
  
});