import joi from "joi";
import { customFetch } from "utils/helpers";

export const updStdPersonalDataSchema = (token, currentUsrUniqueFields) => {


  //checkingMethods
  const CheckUniqueField = async (value, currentUsrUniqueFields, field) => {
    const response = await customFetch('GET', `/student/CheckUniqueFields?field=${field}&value=${value}`, token);
    if (response.status === 200) {
      if (currentUsrUniqueFields[field] === value)
        return value
      throw new joi.ValidationError(
        `any.${field}`,
        [
          {
            message: `${translatorSwitcher(field)} no disponible`,
            path: [field],
            type: `any.${field}`,
            context: {
              key: field,
              label: field,
              value,
            },
          },
        ],
        value
      );
    } else {
      return value;
    }
  }

  const translatorSwitcher = (field) => {
    switch (field) {
      case 'email':
        return 'Email';
      case 'userName':
        return 'Usuario';
      case 'fileNumber':
        return 'Numero de legajo';
      case 'documentNumber':
        return 'Numero de documento';
      case 'cuilCuit':
        return 'Numero CuilCuit'
      default:
        return 'Valor';
    }
  }

  const updStdPersonalData = joi.object({
    userName: joi
      .string(),
    firstName: joi
      .string()
      .regex(/^([a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Debe contener al menos 2 letras',
        'string.max': 'Debe contener como máximo 30 letras',
        'string.base': 'El campo no puede estar vacío',
        'string.empty': 'El campo no puede estar vacío',
        'string.pattern.base':
          'Debe contener solo letras y palabras separadas por un espacio',
      }),
    lastName: joi
      .string()
      .regex(/^([a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Debe contener al menos 2 letras',
        'string.max': 'Debe contener como máximo 30 letras',
        'string.base': 'El campo no puede estar vacío',
        'string.empty': 'El campo no puede estar vacío',
        'string.pattern.base':
          'Debe contener solo letras y palabras separadas por un espacio',
      }),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .external((value) => CheckUniqueField(value, currentUsrUniqueFields, 'email'))
      .required()
      .messages({
        'string.base': 'El campo no puede estar vacío',
        'string.email': 'Debe ingresar un email válido.',
        'string.empty': 'El campo no puede estar vacío.',
      }),
    documentTypeId: joi.string().required().messages({
      'string.empty': 'El campo no puede estar vacío.',
      'string.base': 'El campo no puede estar vacío.'
    }),
    documentNumber: joi
      .string()
      .regex(/^\d+$/)
      .min(8)
      .max(9)
      .external((value) => CheckUniqueField(value, currentUsrUniqueFields, 'documentNumber'))
      .required()
      .messages({
        'string.min': 'Debe contener al menos 8 números',
        'string.max': 'Debe contener como máximo 9 números',
        'string.empty': 'El campo no puede estar vacío.',
        'string.pattern.base': 'Debe contener solo números',
        'string.base': 'El campo no puede estar vacío',
      }),
    birthday: joi
      .date()
      .greater('1-1-1932')
      .less('now')
      .allow('', null)
      .messages({
        'date.greater': 'Su fecha de nacimiento debe ser posterior al año 1931',
        'date.less': 'Su fecha de nacimiento es incorrecta',
        'date.base': 'Debe ingresar una fecha válida'
      }),
    civilStatusTypeId: joi.string().required().messages({
      'string.empty': 'El campo no puede estar vacío.',
      'string.base': 'El campo no puede estar vacío.'
    }),
    fileNumber: joi.string()
      .regex(/^\d+$/)
      .min(5)
      .max(6)
      .external((value) => CheckUniqueField(value, currentUsrUniqueFields, 'fileNumber'))
      .required()
      .messages({
        "string.min": "Debe contener al menos 5 números",
        "string.max": "Debe contener como máximo 6 números",
        "string.empty": "El campo no puede estar vacío",
        "string.pattern.base": "Debe contener solo números",
        "any.fileNumber": "Legajo no disponible",
        'string.base': 'El campo no puede estar vacío',
      }),
    cuilCuit: joi
      .string()
      .min(8)
      .max(11)
      .external((value) => CheckUniqueField(value, currentUsrUniqueFields, 'cuilCuit'))
      .regex(/^\d+$/)
      .allow('', null)
      .messages({
        'string.min': 'Debe contener al menos 8 números',
        'string.max': 'Debe contener como máximo 11 números',
        'string.pattern.base': 'Debe contener solo números',
      }),
    genderTypeId: joi.string().required().messages({
      'string.empty': 'El campo no puede estar vacío.',
      'string.base': 'El campo no puede estar vacío.'
    }),
    address: {
      street: joi
        .string()
        .regex(/^([0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
        .min(1)
        .max(30)
        .allow('', null)
        .messages({
          'string.min': 'Debe contener al menos 1 caracter',
          'string.max': 'Debe contener como máximo 30 caracteres',
          'string.pattern.base': 'Debe contener números o palabras separadas por un espacio',
        }),
      streetNumber: joi
        .string()
        .min(1)
        .max(10)
        .regex(/^\d+$/)
        .allow('', null)
        .messages({
          'string.min': 'Debe contener al menos 1 números',
          'string.max': 'Debe contener como máximo 10 números',
          'string.pattern.base': 'Debe contener solo números',
        }),
      letterBis: joi
        .string()
        .min(1)
        .max(3)
        .alphanum()
        .allow('', null)
        .messages({
          'string.min': 'Debe contener al menos 1 caracter',
          'string.max': 'Debe contener como máximo 3 caracteres',
          'string.alphanum': 'Debe contener caracteres alfanumericos'
        }),
      floor: joi
        .string()
        .min(1)
        .max(2)
        .alphanum()
        .allow('', null)
        .messages({
          'string.min': 'Debe contener al menos 1 caracter',
          'string.max': 'Debe contener como máximo 2 caracteres',
          'string.alphanum': 'Debe contener caracteres alfanumericos'
        }),
      apartment: joi
        .string()
        .min(1)
        .max(2)
        .alphanum()
        .allow('', null)
        .messages({
          'string.min': 'Debe contener al menos 1 caracter',
          'string.max': 'Debe contener como máximo 2 caracteres',
          'string.alphanum': 'Debe contener caracteres alfanumericos'
        }),
      postalCode: joi
        .string()
        .max(10)
        .alphanum()
        .allow('', null)
        .messages({
          'string.max': 'Debe contener como máximo 10 caracteres',
          'string.alphanum': 'Debe contener caracteres alfanumericos'
        }),
      city: joi
        .string()
        .min(1)
        .max(50)
        .regex(/^([a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
        .required()
        .messages({
          'string.min': 'Debe contener al menos 1 caracter',
          'string.max': 'Debe contener como máximo 50 caracteres',
          'string.pattern.base': 'Debe contener palabras separadas por un espacio',
          'string.base': 'El campo no puede estar vacío',
          'string.empty': 'El campo no puede estar vacío',
        })
    },

    phoneNumber: joi
      .string()
      .min(5)
      .max(20)
      .regex(/^\d+$/)
      .allow('', null)
      .messages({
        'string.min': 'Debe contener al menos 5 números',
        'string.max': 'Debe contener como máximo 20 números',
        'string.pattern.base': 'Debe contener solo números',
      })

  })


  return updStdPersonalData;
};