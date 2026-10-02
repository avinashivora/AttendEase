exports.parseISTDate = (istDateString) => {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5.5 hours ahead of UTC)
    const date = new Date(istDateString);
    return new Date(date.getTime() - istOffset);
};

exports.generateOtp = (n) => {
    let otp = null
    for (let i=0;i<n;i++){
        const randomNumber = Math.floor(Math.random()*10)
        otp = otp*10 + randomNumber
    }
    return otp
}      