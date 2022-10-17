// email


// notifications



// OTP
export const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return { otp, expiry };
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {

    const accountSid = "ACfa49cf3f8979635fc251d01b269af0f1";
    const authToken = "50e2ce0105f92be0be8c2f55572e4064";

    const client = require('twilio')(accountSid, authToken)

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: +13252195548,
        to: toPhoneNumber,
    })

    return response;
}