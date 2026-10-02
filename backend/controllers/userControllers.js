const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Teacher = require('./../models/teachers')
const Students = require("./../models/studentsSchema")
const { generateRandomString } = require("./../utils/generateRandomString")
const { generateOtp } = require("./../utils/utils")
const nodeMailer = require('nodemailer')
// const { checkLimit, incMail } = require('../middleware/mailRestricter')

const { appendFileSync } = require('fs');
const origConsole = globalThis.console;

const saveConsole = {
    log: (...args) => {
        appendFileSync('./utils/Reset_Pass_creds.txt', args.join('\n') + '\n');
        return origConsole.log.apply(origConsole, args);
    }
}

const saveNewRegister = {
    log: (...args) => {
        appendFileSync('./utils/New_Registeration_Creds.txt', args.join('\n') + '\n');
        return origConsole.log.apply(origConsole, args);
    }
}

const forgotPass = {
    log: (...args) => {
        appendFileSync('./utils/Forgot_Pass.txt', args.join('\n') + '\n');
        return origConsole.log.apply(origConsole, args);
    }
}

require("dotenv").config({
    path: "./../.env"
})

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
}

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'developercell.sksc@somaiya.edu',
        pass: process.env.MAIL_SECRET,
    }
});

exports.login = (req, res) => {

    User.findOne({ email: req.body.email }).then(user => {
        if (!user.authenticate(req.body.password)) {
            return res.status(400).json({
                status: false,
                message: "Password doesn't Match"
            })
        } else {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, { expiresIn: '1d' });
            const { _id, firstName, lastName, middleName, email, role } = user;
            if (user.role === 1) {
                Teacher.findById(user.teacherId).then(teacherData => {
                    if (teacherData.isActive === false) {
                        console.log("uviycvi")
                        return res.status(200).send({
                            message: 'Your Portal is In-Active. Contact Admin',
                            status: false
                        })
                    } else {
                        teacherData.selectQuery.sort((a, b) => a.semester - b.semester)
                        return res.json({
                            status: true,
                            token,
                            user: { _id, firstName, lastName, middleName, email, role, teacherData },
                        });
                    }
                })
            }
            else if (user.role === 0) {
                Students.findById(user.studentId).then(studentData => {
                    return res.json({
                        status: true,
                        token,
                        user: { _id, firstName, lastName, middleName, email, role, studentData }
                    });
                })
            }
            else {
                return res.json({
                    status: true,
                    token,
                    user: { _id, firstName, lastName, middleName, email, role },
                    data: null
                })
            }
        }
    }).catch(err => {
        console.log(err)
        return res.status(400).send({
            status: false,
            message: 'User with this email does not exists',
            error: err
        })
    })
}

exports.register = async (req, res) => {

    console.log(req.body)
    try {
        // if (checkLimit()) {
        //     return res.status(503).json({
        //         status: false,
        //         message: "Mail service unavailable at the moment! Please try again tomorrow."
        //     })
        // }
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({
                status: false,
                message: "User already exists"
            })
        } else {
            const randomPassword = generateRandomString(8)
            let newUser;
            if (req.body.role === 0) {
                const newStudent = await Students.create({
                    name: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
                    email: req.body.email,
                    semester: req.body.semester,
                    seatNumber: req.body.seatNumber,
                    course: req.body.course,
                    subjects: req.body.subjects,
                    subjectType: req.body.subjectType,
                    batch: req.body.batch
                })
                newUser = await User.create({
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: randomPassword,
                    role: req.body.role,
                    studentId: newStudent._id
                })
            }

            else if (req.body.role === 1) {

                const newTeacher = await Teacher.create({
                    name: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
                    email: req.body.email,
                    isActive: req.body.semester,
                    visitingFaculty: req.body.visitingFaculty,
                    selectQuery: req.body.selectQuery,
                })

                newUser = await User.create({
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: randomPassword,
                    role: req.body.role,
                    teacherId: newTeacher._id
                })
            }
            saveNewRegister.log(`Email: ${req.body.email} Password: ${randomPassword} Date and Time: ${getCurrentDateTime()}`)

            const mailOptions = {
                from: "developercell.sksc@somaiya.edu",
                to: newUser.email,
                subject: "Introducing AttendEase: Your New Attendance System",
                text: `
                      Dear ${newUser.firstName} ${newUser.lastName},
                      
                      We are the **Developer Cell** of S.K. Somaiya College, Somaiya Vidyavihar University. Our mission is to develop innovative solutions to address the challenges faced by the college community.
                      
                      We feel immense pride to introduce you to one such solution that we have successfully designed and developed - **AttendEase, the official attendance system of our college**. It is now going to be implemented for all the academic courses provided by our college starting with the Majors courses.
                      
                      **AttendEase** is a user-friendly online platform that allows faculty and staff to efficiently record student attendance. The application utilizes geolocation to verify a student's presence within the designated learning area. **AttendEase** is compatible with Android and iOS devices.
                      
                      For **Android** users, the application can be installed directly on your mobile device following a simple installation process. The Google Drive link below includes the **APK download file** supporting the Android platform, along with a comprehensive user manual that provides step-by-step instructions on downloading, installing, and using the AttendEase application.
                      
                      For **iOS** users, the application will shortly arrive on the **App Store**.
                      
                      We urge you to go through the **User Manual** thoroughly that has been put together for your **enhanced User Experience**.
                      
                      We encourage you to explore the app and familiarize yourself with its features.
                      
                      **Note**: This link can only be accessed by users with a valid Somaiya email-id.
                      **Drive link:** https://drive.google.com/drive/folders/1tTzKxxNvFGetmI6vBF4dlealrQe2gEYU?usp=sharing
                      
                      Your Login credentials for the application are as follows:
                      **Email**: ${newUser.email}
                      **Password**: ${newUser.password}
                      
                      We believe that **AttendEase** will prove to be significantly effective for the attendance tracking process and save valuable time for both students and teachers.
                      
                      For any technical assistance or your personal data-related issues within the application, please contact the Developer Cell: developercell.sksc@somaiya.edu
                      
                      Thank you for your cooperation.
                      
                      Sincerely,
                      The Developer Cell,
                      S.K. Somaiya College,
                      Somaiya Vidyavihar University
                      `,
                html: `
                    <p>Dear ${newUser.firstName} ${newUser.lastName},</p>
                    <p>We are the <b>Developer Cell</b> of S.K. Somaiya College, Somaiya Vidyavihar University. Our mission is to develop innovative solutions to address the challenges faced by the college community.</p>
                    <p>We feel immense pride to introduce you to one such solution that we have successfully designed and developed - <b>AttendEase, the official attendance system of our college</b>. It is now going to be implemented for all the academic courses provided by our college starting with the Majors courses.</p>
                    <p><b>AttendEase</b> is a user-friendly online platform that allows faculty and staff to efficiently record student attendance. The application utilizes geolocation to verify a student's presence within the designated learning area. <b>AttendEase</b> is compatible with <b>Android and iOS devices</b>.</p>
                    <p>For <b>Android</b> users, the application can be installed directly on your mobile device following a simple installation process. The Google Drive link below includes the <b>APK download file</b> supporting the Android platform, along with a comprehensive user manual that provides step-by-step instructions on downloading, installing, and using the <b>AttendEase</b> application.</p>
                    <p>For <b>iOS</b> users, the application will shortly arrive on the <b>App Store</b>.</p>
                    <p>We urge you to go through the <b>User Manual</b> thoroughly that has been put together for your <b>enhanced User Experience</b>.</p>
                    <p>We encourage you to explore the app and familiarize yourself with its features.</p>
                    <p><b>Note:</b> This link can only be accessed by users with a valid Somaiya email-id.<br>
                    <b>Drive link:</b> <a href="https://drive.google.com/drive/folders/1tTzKxxNvFGetmI6vBF4dlealrQe2gEYU?usp=sharing">https://drive.google.com/drive/folders/1tTzKxxNvFGetmI6vBF4dlealrQe2gEYU?usp=sharing</a></p>
                    <p>Your Login credentials for the application are as follows:<br>
                    <b>Email:</b> ${newUser.email}<br>
                    <b>Password:</b> ${newUser.password}</p>
                    <p>We believe that <b>AttendEase</b> will prove to be significantly effective for the attendance tracking process and save valuable time for both students and teachers.</p>
                    <p>For any technical assistance or your personal data-related issues within the application, please contact the <b>Developer Cell</b>: <a href="mailto:developercell.sksc@somaiya.edu">developercell.sksc@somaiya.edu</a></p>
                    <p>Thank you for your cooperation.</p>
                    <p>Sincerely,<br>
                    The Developer Cell,<br>
                    S.K. Somaiya College,<br>
                    Somaiya Vidyavihar University</p>
                  `,
            };

            transporter.sendMail(mailOptions)
                .then(async (info) => {
                    console.log(`Email sent to ${req.body.firstName}: ` + info.response);
                    const updatedUser = await User.findByIdAndUpdate(newUser._id, { sentMail: true })
                    if (updatedUser) {
                        console.log("User updated")
                    }
                    // incMail();
                })
                .catch(error => {
                    console.error(`Error sending email for ${req.body.firstName}: ${error.message}`);
                });



            return res.status(200).json({
                success: true,
                newUser
            })
        }
    } catch (err) {
        console.log(err)
        if (err.code === 11000) {
            const fieldName = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                message: `Duplicate value for field: '${fieldName}'`,
                success: false
            });
        }
        return res.status(500).json({
            error: err,
            success: false
        })
    }
}

exports.updatePassword = (req, res) => {
    // if (checkLimit()){
    //     return res.status(503).json({
    //         status: false,
    //         message: "Mail service unavailable at the moment! Please try again tomorrow."
    //     })
    // }
    console.log(req.params, req.body)
    User.findOne({ email: req.params.email }).then((user) => {
        if (!user.authenticate(req.body.prevPass)) {
            return res.status(400).json({
                status: false,
                error: "Old Password doesn't Match"
            })
        } else {
            User.findByIdAndUpdate(user._id, {
                $set: { hashed_password: user.encryptPassword(req.body.confirmPass) }
            }, { new: true }).then(success => {
                saveConsole.log(`Email: ${user.email} Password: ${req.body.confirmPass} Date and Time: ${getCurrentDateTime()}`)
                const mailOption = {
                    from: 'developercell.sksc@somaiya.edu',
                    to: user.email,
                    subject: 'Password Reset Confirmation',
                    text: `Dear ${user.firstName} ${user.lastName},\n\nThis email is to confirm that your password for your [Your Company/Product Name] account has been successfully reset.\n\nIf you initiated this password reset request, you can now log in to your account using your new password.\n\nIf you did not request this password reset or believe your account has been compromised, please contact our support team immediately for assistance.`,
                    html: `<p>Dear ${user.firstName} ${user.lastName},</p>
                <p>This email is to confirm that your password for your <a href="https://192.168.246.211:7000">https://192.168.246.211:7000/</a> account has been successfully reset.</p>
                <p>If you initiated this password reset request, you can now log in to your account using your new password.</p>
                <p>If you did not request this password reset or believe your account has been compromised, please contact our support team immediately for assistance.</p>`
                }

                // transporter.sendMail(mailOption).then(info => {
                //     console.log(`Email send to ${user.email}: ` + info.response)
                //     incMail();
                // }).catch(error => {
                //     console.error(`Error sending email for ${user.name}: ${error.message}`);
                // });

                res.json({
                    status: true,
                    success
                })
                console.log(success)
            }).catch(err => {
                console.log(err)
            })
        }
    })
}

exports.serverLive = (req, res) => {
    res.send({
        status: true,
        message: 'Server Live'
    })
}

exports.generateOtpForForgotPassword = async (req, res) => {
    try {
        // if (checkLimit()){
        //     return res.status(503).json({
        //         status: false,
        //         message: "Mail service unavailable at the moment! Please try again tomorrow."
        //     })
        // }
        const otp = generateOtp(4)
        const user = await User.findOneAndUpdate({ email: req.body.email }, { $set: { otp: otp } }, { new: true })
        if (!user) {
            return res.json({
                success: false,
                message: "Email does not exist"
            })
        } else {
            console.log(user.otp)
            const mailOption = {
                from: 'developercell.sksc@somaiya.edu',
                to: user.email,
                subject: 'Password Reset OTP',
                text: `Dear ${user.firstName} ${user.lastName},\n\nYour OTP (One-Time Password) for resetting your password is: ${user.otp}.\n\nIf you did not request this password reset, please ignore this email.\n\nBest regards,\n[Your Name]\n[Your Company/Product Name]`,
                html: `<p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Your OTP (One-Time Password) for resetting your password is: <strong>${user.otp}</strong>.</p>
            <p>If you did not request this password reset, please ignore this email.</p>`
            }

            transporter.sendMail(mailOption).then(info => {
                console.log(`Email send to ${user.email}: ` + info.response)
                // incMail();
            }).catch(error => {
                console.error(`Error sending email for ${user.name}: ${error.message}`);
            });
            return res.json({
                success: true,
                message: "Check your email"
            })
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            success: false
        })
    }
}

exports.resetPasswordByOtp = async (req, res) => {
    try {
        // if (checkLimit()){
        //     return res.status(503).json({
        //         status: false,
        //         message: "Mail service unavailable at the moment! Please try again tomorrow."
        //     })
        // }
        const user = await User.findOne({ email: req.body.email })
        if (user.otp === req.body.otp * 1) {
            const updatedUser = await User.findOneAndUpdate({ email: req.body.email }, { $set: { otp: null, hashed_password: user.encryptPassword(req.body.password) } }, { new: true })
            if (!updatedUser) {
                return res.json({
                    success: false,
                    message: "There was error updating Password"
                })
            } else {
                forgotPass.log(`Email: ${req.body.email} Password: ${req.body.password} OTP: ${req.body.otp} Date and Time: ${getCurrentDateTime()}`)
                const mailOption = {
                    from: 'developercell.sksc@somaiya.edu',
                    to: user.email,
                    subject: 'Password Reset Confirmation',
                    text: `Dear ${updatedUser.firstName} ${updatedUser.lastName},\n\nThis email is to confirm that your password for your [Your Company/Product Name] account has been successfully reset.\n\nIf you initiated this password reset request, you can now log in to your account using your new password.\n\nIf you did not request this password reset or believe your account has been compromised, please contact our support team immediately for assistance.`,
                    html: `<p>Dear ${updatedUser.firstName} ${updatedUser.lastName},</p>
                <p>This email is to confirm that your password for your <a href="https://192.168.246.211:7000">https://192.168.246.211:7000/</a> account has been successfully reset.</p>
                <p>If you initiated this password reset request, you can now log in to your account using your new password.</p>
                <p>If you did not request this password reset or believe your account has been compromised, please contact our support team immediately for assistance.</p>`
                }

                transporter.sendMail(mailOption).then(info => {
                    console.log(`Email send to ${user.email}: ` + info.response)
                    // incMail();
                }).catch(error => {
                    console.error(`Error sending email for ${user.name}: ${error.message}`);
                });
                return res.json({
                    success: true,
                    message: "password updated"
                })
            }
        }
        res.json({
            success: false,
            message: "Invalid OTP"
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            success: false
        })
    }
}