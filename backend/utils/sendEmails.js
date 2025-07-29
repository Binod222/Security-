import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to, code) => {
    // Your debug logs will now show the correct variables
    console.log('--- Nodemailer Debug ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER); // Changed
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined'); // Changed
    console.log('EMAIL_PASS is not empty/null:', !!process.env.EMAIL_PASS); // Changed
    console.log('--- End Nodemailer Debug ---');

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER, // ✅ CHANGE THIS LINE
            pass: process.env.EMAIL_PASS, // ✅ CHANGE THIS LINE
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // ✅ CHANGE THIS LINE
        to,
        subject: "Verify your account",
        text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};