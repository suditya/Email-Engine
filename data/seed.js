const { execSync } = require('child_process');

const DB_NAME = 'EmailCommunicationEnginDB';

try {
    execSync(`mongoimport --db ${DB_NAME} --collection meetings --drop --file "${process.cwd()}/data/seed/meetings.json" --jsonArray`);
    console.log(`imported documents into database ${DB_NAME}`);

} catch (error) {
    console.log(`could not import documents into database ${DB_NAME}`);
    console.error(error);
}