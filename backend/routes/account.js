const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require("mongoose");
const zod = require("zod");
const jwt = require("jsonwebtoken")

const router = express.Router();

router.post("/balance", authMiddleware, async (req, res) => {
    const {userId} = jwt.decode(req.body.userId);
    const account = await Account.findOne({
        userId: userId
    });

    res.json({
        balance: account.balance
    })
});

const transferSchema = zod.object({
    to : zod.string(),
    amount : zod.number()
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const { success } = transferSchema.safeParse(req.body);

    if(!success){
        return res.status(403).json({
            message : "Inavalid Inputs"
        })
    }

    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;