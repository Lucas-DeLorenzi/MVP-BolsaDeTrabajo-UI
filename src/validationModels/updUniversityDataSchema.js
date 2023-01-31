import joi from 'joi';

export const updUniversityData = joi.object({
    degreeId: joi.string().required().messages({
        'string.empty': 'El campo no puede estar vacío.',
        'string.base': 'El campo no puede estar vacío.'
    }),
    approvedSubjects: joi.number()
        .greater(0)
        .max(65)
        .integer()
        .required()
        .messages({
            'number.greater': 'Debe contener al menos 1 materia',
            'number.max': 'Cantidad de materias no válida',
            'number.base': 'Debe ser un número entero',
            'number.unsafe': 'Debe ser un número entero',
            'number.integer': 'Debe ser un número entero',
        }),
    degreePlanYear: joi.number()
        .greater(1989)
        .max(new Date().getFullYear())
        .integer()
        .required()
        .messages({
            'number.greater': 'El año del plan no puede ser menor a 1990',
            'number.max': 'El año no puede ser mayor al actual',
            'number.base': 'El año debe ser un número entero',
            'number.unsafe': 'El año debe ser un número entero',
            'number.integer': 'El año debe ser un número entero',
        }),
    currentCourseYear: joi.string().required().messages({
        'string.empty': 'El campo no puede estar vacío.',
        'string.base': 'El campo no puede estar vacío.'
    }),
    courseShift: joi.string().required().messages({
        'string.empty': 'El campo no puede estar vacío.',
        'string.base': 'El campo no puede estar vacío.'
    }),
    averageWithHeldBacks: joi.number()
        .greater(0)
        .max(10)
        .required()
        .messages({
            'number.greater': 'El promedio debe ser mayor a 0',
            'number.max': 'El promedio no puede ser superior a 10',
            'number.unsafe': 'Debe ser un número',
            'number.base': 'Debe ser un número',
            'number.empty': 'El campo es requerido'
        }),
    averageWithoutHeldBacks: joi.number()
        .greater(0)
        .max(10)
        .required()
        .messages({
            'number.greater': 'El promedio debe ser mayor a 0',
            'number.max': 'El promedio no puede ser superior a 10',
            'number.unsafe': 'Debe ser un número',
            'number.base': 'Debe ser un número',
            'number.empty': 'El campo es requerido'
        })
})