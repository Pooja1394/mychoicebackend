import jwt from "jsonwebtoken";
export default function createToken(payload: any, expiry: number): string {
    return jwt.sign(payload, "ADIOS AMIGOS", {expiresIn: expiry});
}