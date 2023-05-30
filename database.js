const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect('mongodb+srv://s222569633:EuGEkRQS9Itbr1zc@cluster0.te72ucw.mongodb.net/Kidsapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Could not connect to MongoDB", error);
        process.exit(1);
    }
};

module.exports = connection;
