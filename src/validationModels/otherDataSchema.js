import joi from "joi";

export const otherDataSchema = joi.object({
  highSchoolDegree: joi
    .string()
    .allow(null, '')
    .min(2)
    .max(50)
    .messages({
      "string.min": "Debe contener al menos 2 letras",
      "string.max": "Debe contener como máximo 50 letras",
      "any.required": "Este campo es obligatorio",
      "string.empty": "Este campo es obligatorio",
      "string.pattern.base":
        "Debe contener solo letras y palabras separadas por un espacio",
    }),
  observations: joi
    .string()
    .allow(null, '')
    .min(2)
    .max(300)
    .messages({
      "string.min": "Debe contener al menos 2 letras",
      "string.max": "Debe contener como máximo 300 letras",
      "any.required": "Este campo es obligatorio",
      "string.empty": "Este campo es obligatorio",
    }),
  curriculum: joi
    .object()
    .unknown(true),
  fileName: joi
    .string()
    .allow(null, '')
});