const multer = require('multer');
const path = require('path');
const AuctionUser = require('../models/auctionUsersModel.js');
const User = require('../models/registerUsersModel.js');
const auctions = new Map();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).single('file');
// fuction to add products 
exports.addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        try {
            const { productName, description, currentPrice, category, initial_price, auction_time, isActive } = req.body;
            if (!req.file) {
                return res.status(400).json({ error: "File is required" });
            }
             const user = await User.findByPk(req.userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
          const auctionProduct = await AuctionUser.create({
                productName,
                description,
                currentPrice,
                category,
                filename: req.file.filename,
                filepath: req.file.path,
                initial_price,
                auction_time,
                isActive,
                user_id: req.userId  
            });
            res.status(201).json({ auction: auctionProduct });
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ error: error.message });
        }
    });
};
// Fuction to upadte certificates
exports.updateFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        try {
            const { id } = req.body;
            if (!req.file) {
                return res.status(400).json({ error: 'File upload is mandatory for update' });
            }
             const existingFile = await AuctionUser.findByPk(id);
            if (!existingFile) {
                return res.status(404).json({ error: 'File not found' });
            }
            existingFile.filename = req.file.filename;
            existingFile.filepath = req.file.path;
            await existingFile.save();
            res.status(200).json({ message: 'File updated successfully', file: existingFile });
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ error: error.message });
        }
    });
};
// Fuction to delete certificates 
exports.deleteFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        try {
            const {id} = req.body; 
            const fileToDelete = await AuctionUser.findByPk(id);
            if (!fileToDelete) {
                return res.status(404).json({ error: 'File not found' });
            }
            await fileToDelete.destroy();
            res.status(200).json({ message: 'File deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }) 
};
// Starting Auction System 
exports.auctionStart = async (req, res) => {
    try {
        const { product_id, time } = req.body;
        const product = await AuctionUser.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (time !== '12:00') {
            return res.status(400).json({ error: 'Invalid auction time' });
        }    
        const endTime = Date.now() + 600000; // 6 minute auction time
        auctions.set(product_id, endTime);
        console.log(`Auction started for product_id ${product_id} and will end at ${new Date(endTime).toLocaleTimeString()}`);
        setTimeout(async () => {
            await endAuction(product_id);
        }, 600000); // 1 minute
        res.status(200).json({ message: 'Auction has started' });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: error.message });
    }
};
// Function to check auction status
exports.checkAuctionStatus = (req, res) => {
    const { product_id } = req.body;
    const endTime = auctions.get(product_id);
    if (typeof endTime !== 'number') {
        console.log(`Invalid endTime for product_id ${product_id}:`, endTime);
        return res.status(404).json({ error: `Invalid endTime for product_id ${product_id}:`, endTime });
    }
    const timeRemaining = endTime - Date.now();
    if (timeRemaining <= 0) {
        return res.status(404).json({ error: 'Auction already ended' });
    }
    console.log(`Auction status checked for product_id ${product_id}, time remaining: ${timeRemaining / 600000} seconds`);
    res.status(200).json({ message: `Auction for product_id ${product_id} will end in ${timeRemaining / 600000} seconds` });
};
