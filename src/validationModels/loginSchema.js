import joi from "joi";

export const loginSchema = joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Debe ingresar un email válido.',
        'string.empty': 'El campo es obligatorio.'
      }),
    password: joi
      .string()
      .required()
      .messages({
        'string.min': 'El campo es obligatorio',
        'string.empty' : 'El campo es obligatorio'
      }
      )
  });

  export const passwordSchema = joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Debe ingresar un email válido.',
        'string.empty': 'El campo es obligatorio.'
      })
  });

  export const newPasswordSchema = joi.object({
    code: joi
      .string()
      .regex(/^([0-9a-zA-Z]+\s)*[0-9a-zA-Z]+$/)
      .min(1)
      .max(30)
      .required()
      .messages({
        "string.min": "Debe contener al menos 1 caracter",
        "string.max": "Debe contener como máximo 30 caracteres",
        "any.required": "Este campo es obligatorio",
        "string.empty": "Este campo es obligatorio",
        "string.pattern.base":
          "Debe contener letras o numeros y palabras separadas por un espacio",
      }),
    password: joi
      .string()
      .regex(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/)
      .min(6)
      .max(30)
      .required()
      .messages({
        "string.min": "Debe contener al menos 6 caracteres",
        "string.max": "Debe contener como máximo 30 caracteres",
        "string.empty": "Este campo es obligatorio",
        "string.pattern.base":
          "Debe contener caracteres alfanumericos, al menos uno de cada uno",
        "any.required": "Este campo es obligatorio",
      }),
    passwordConfirm: joi.string().required().valid(joi.ref("password")).messages({
      "any.required": "El campo es obligatorio",
      "string.empty": "El campo es obligatorio",
      "any.only": "Debe repetir la contraseña",
    }),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Debe ingresar un email válido.",
        "string.empty": "El campo es obligatorio.",
      }),
  });