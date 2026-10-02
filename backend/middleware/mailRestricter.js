const lockFile = require('proper-lockfile')
const { readFile, writeFile } = require('fs').promises
const { Mutex } = require('async-mutex')
const mutex = new Mutex()

exports.checkLimit = async () => {
    let release
    try {
        release = await mutex.acquire();
        let count = await readFile('../middleware/emailCount.txt', 'utf8')
        if (count === "") {
            console.log("emailCount.txt file is empty")
            return true
        }
        count = parseInt(count, 10)
        if (isNaN(count)) {
            console.log("Error in parseInt, Count variable is not able to read a number")
            return true
        }
        console.log(count)
        return count >= 1
    } catch (error) {
        console.log("Error reading emailCount.txt: ", error)
        return true
    }
    finally {
        if (release) release(); // Ensure lock is released
    }
}

exports.incMail = async () => {
    let lock
    try {
        let count = 0;
        lock = await lockFile.lock('../middleware/emailCount.txt')
        console.log('File locked')
        try {
            const data = await readFile('../middleware/emailCount.txt', 'utf8')
            count = parseInt(data, 10)
        } catch (error) {
            console.log("Error reading emailCount.txt", error)
        }

        if (isNaN(count)) {
            console.log("Error in parseInt, skipping increment");
            return
        }

        try {
            await writeFile('../middleware/emailCount.txt', (count + 1).toString(), 'utf8')
            console.log("Mail count incremented");
        } catch (error) {
            console.error("Error writing emailCount.txt:", error);
        }
    } catch (error) {
        console.error("Error acquiring lock:", error);
    } finally {
        if (lock) {
            try {
                await lock()
                console.log('Lock released');
            } catch (error) {
                console.log("Error releasing lock:", error)
            }
        }

    }
}