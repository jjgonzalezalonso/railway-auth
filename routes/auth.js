const {Router} =require('express');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router= Router();

router.post('/new',[
            check('name','El nombre es obligatorio').not().isEmpty(),
            check('email','El email es obligatorio').isEmail(),
            check('password','El password es obligatorio').isLength({min:6}),
            validarCampos
        ], crearUsuario);

        router.post('/', [
             check('email','El email es obligatorio').isEmail(),
             check('password','El password es obligatorio').isLength({min:6}),
             validarCampos
        ],loginUsuario);
router.get('/renew', validarJWT, revalidarToken);

module.exports=router;