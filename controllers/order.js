const order = require('../models/Order');
const errorHandler = require('../utils/errorHanler');

module.exports.getAll = async function (req, res) {
    try {

        const query = {
            user: req.user.id
        };

        if (req.query.start) {
            query.date = {
                //greater then equal
                $gte: req.query.start
            }
        }

        if (req.query.end) {
            query.date = !query.date ? {} : query.date;
            //less then equal
            query.date['$lte'] = req.query.end;
        }

        if (req.query.order) {
            query.order = +req.query.order;
        }

        const orders = await Order
            .find(query)
            .sort({data: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit);

        res.status(200).json(orders);

    } catch (e) {
        errorHandler(e);
    }
};

module.exports.create = async function (req, res) {
    try {
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1}); //date DESC

        const maxOrder = lastOrder ? lastOrder.order : 0;

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save();

        res.status(201).json(order);
    } catch (e) {
        errorHandler(e);
    }
};