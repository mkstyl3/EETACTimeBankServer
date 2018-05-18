const Joi = require ('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                let type = result.error.details[0].path[0];
                return res.status(400).json( { 'validationError' : type } );
            }

            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;   
            next();
        }
    },

    schemas: {
        signUp: Joi.object().keys({
            name: Joi.string().alphanum().min(3).max(30).required(),
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            mail: Joi.string().email().required()
        }),
        signIn: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
        }),
        updateActivity: Joi.object().keys({ 
            name: Joi.string().required(),
            cost: Joi.number().integer().required(),
            description: Joi.string().alphanum().required(),
            tag: Joi.array().required()
        }),
    }
};