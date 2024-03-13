const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    firstName:{
        type: String,
        required:true,
    },
    secondName: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required:true
    },
    mobile:{
        type:String,
        required: false,
        default: ""
    },
    birthDate:{
        type:String,
        required: false,
        default: ""
    },
    placeOfBirth:{
        type:String,
        required: false,
        default: ""
    },
    address:{
        type:String,
        required: false,
        default: ""
    },
    savedPrograms: [

    ],
    isAdmin:{
        type:Boolean,
        required: false,
        default: false
    }
})
// static signup method
userSchema.statics.signup = async function(email, firstName, secondName, password, ) {

    //validation
    if (!email || !password){
        throw Error('Minden mező kitöltése kötelező')
    }

    if (!validator.isEmail(email)){
        throw Error('Az emailcím nem létezik')
    }

    if (!validator.isStrongPassword(password)){
        throw Error('Nem elég erős a jelszó')
    }



    //check if the email exists
    const exists = await this.findOne({ email })

    if(exists){
        throw Error('Ezzel az emailcímmel már regisztráltak')
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, firstName, secondName, password: hash })

    return user

}
// static login method

userSchema.statics.login = async function (email,password) {

    const user = await this.findOne({email})
    if(!user){
        throw Error('Ezzel az emailcímmel nem található felhasználó')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Hibás jelszó')
    }

    return user;
}

userSchema.statics.loginwithlink = async function (id) {
    const user = await this.findOne({_id: id})
    if(!user){
        throw Error('Ez a felhasználó nem létezik!')
    }
    return user;
}




module.exports = mongoose.model('User', userSchema)