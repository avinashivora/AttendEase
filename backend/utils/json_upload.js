const { exec } = require('child_process');



// change the field after --colection
const command = `mongoimport --db attendance-v1 --collection courses --file D:/dev-cell/attendance_v1/backend/data/courseData.json --jsonArray --host localhost --port 27017`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});