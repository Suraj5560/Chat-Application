import jwt from "jsonwebtoken";


export function generateToken(userId) {

    const token = jwt.sign({ userId }, "&&^*&*77878*^&*")
    return token;
}

