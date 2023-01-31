import joi from 'joi';

export const updCompanyDataSchema = (uniqueFields, currentUniqueFields) => {

    const checkUniqueField = (value, uniqueFields, currentUniqueFields, field) => {
        let match = uniqueFields.filter(f => f[field] === value && f[field] !== currentUniqueFields[field])
        if (match.length === 0) {
            return value;
        } else {
            throw new Error('cuilCuit is not allowed');
        }
    }

    const updCompanyData = joi.object({
        businessName: joi
            .string()
            .regex(/^([0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
            .min(1)
            .max(30)
            .custom((value) => checkUniqueField(value, uniqueFields, currentUniqueFields, 'businessName'))
            .required()
            .messages({
                'string.min': 'Debe contener al menos 1 caracter',
                'string.max': 'Debe contener como máximo 30 caracteres',
                'string.base': 'El campo no puede estar vacío',
                'string.empty': 'Este campo es obligatorio',
                'any.custom': 'Razón social no disponible',
                'string.pattern.base':
                    'Debe contener letras o numeros y palabras separadas por un espacio',
            }),
        cuilCuit: joi
            .string()
            .min(8)
            .max(11)
            .regex(/^\d+$/)
            .custom((value) => checkUniqueField(value, uniqueFields, currentUniqueFields, 'cuilCuit'))
            .required()
            .messages({
                'string.min': 'Debe contener al menos 8 números',
                'string.max': 'Debe contener como máximo 11 números',
                'string.base': 'El campo no puede estar vacío',
                'any.custom': 'El Cuil Cuit no está disponible',
                'string.empty': 'Este campo es obligatorio',
                'string.pattern.base': 'Debe contener solo números',
            }),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .custom((value) => checkUniqueField(value, uniqueFields, currentUniqueFields, 'email'))
            .required()
            .messages({
                'string.email': 'Debe ingresar un email válido.',
                'string.base': 'El campo no puede estar vacío',
                'any.custom': 'El email no está disponible',
                'string.empty': 'El campo no puede estar vacío.',
            }),
        sector: joi
            .string()
            .regex(/^([a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.min': 'Debe contener al menos 2 letras',
                'string.max': 'Debe contener como máximo 30 letras',
                'string.empty': 'El campo no puede estar vacío',
                'string.base': 'El campo no puede estar vacío',
                'string.pattern.base':
                    'Debe contener solo letras y palabras separadas por un espacio',
            }),
        phoneNumber: joi
            .string()
            .min(5)
            .max(20)
            .required()
            .regex(/^\d+$/)
            .messages({
                'string.base': 'El campo no puede estar vacío.',
                'string.min': 'Debe contener al menos 5 números',
                'string.max': 'Debe contener como máximo 20 números',
                'string.pattern.base': 'Debe contener solo números',
                "string.empty": "Este campo es obligatorio",
                "any.required": "Este campo es obligatorio",
            }),
        webSite: joi
            .string()
            .min(3)
            .max(100)
            .allow('', null)
            .messages({
                'string.min': 'Debe contener al menos 3 caracteres',
                'string.max': 'Debe contener como máximo 100 caracteres',
            }),
        contact: {
            relationTypeId: joi.string().required().messages({
                'string.empty': 'El campo no puede estar vacío.',
                'string.base': 'El campo no puede estar vacío.'
            }),
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
                        'Debe contener solo letras',
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
                        'Debe contener solo letras',
                }),
            phone: joi
                .string()
                .min(5)
                .max(20)
                .regex(/^\d+$/)
                .required()
                .messages({
                    'string.min': 'Debe contener al menos 5 números',
                    'string.max': 'Debe contener como máximo 20 números',
                    'string.base': 'El campo no puede estar vacío',
                    'string.empty': 'El campo no puede estar vacío',
                    'string.pattern.base': 'Debe contener solo números',
                }),
            position: joi
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
                        'Debe contener solo letras',
                }),
            email: joi
                .string()
                .email({ tlds: { allow: false } })
                .required()
                .messages({
                    'string.email': 'Debe ingresar un email válido.',
                    'string.empty': 'El campo no puede estar vacío.',
                    'string.base': 'El campo no puede estar vacío',
                }),
        },
        address: {
            street: joi
                .string()
                .regex(/^([0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+\s)*[0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
                .min(1)
                .max(30)
                .required()
                .messages({
                    'string.min': 'Debe contener al menos 1 caracter',
                    'string.max': 'Debe contener como máximo 30 caracteres',
                    'string.pattern.base': 'Debe contener números o palabras separadas por un espacio',
                    'string.base': 'El campo no puede estar vacío',
                    'string.empty': 'El campo no puede estar vacío',
                }),
            streetNumber: joi
                .string()
                .min(1)
                .max(10)
                .regex(/^\d+$/)
                .required()
                .messages({
                    'string.min': 'Debe contener al menos 1 números',
                    'string.max': 'Debe contener como máximo 10 números',
                    'string.pattern.base': 'Debe contener solo números',
                    'string.base': 'El campo no puede estar vacío',
                    'string.empty': 'El campo no puede estar vacío',
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
                .required()
                .messages({
                    'string.max': 'Debe contener como máximo 10 caracteres',
                    'string.alphanum': 'Debe contener caracteres alfanumericos',
                    'string.base': 'El campo no puede estar vacío',
                    'string.empty': 'El campo no puede estar vacío',
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
        }
    })
    return updCompanyData;
};