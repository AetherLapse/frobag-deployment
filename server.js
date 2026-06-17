const dotenv = require('dotenv');
dotenv.config();

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = require('./src/db/db');
const app = require('./src/app'); // ← now actually used

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));