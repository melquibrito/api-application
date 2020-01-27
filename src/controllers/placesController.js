const visited = require("../models/Place");

exports.get = (req, res) => {
    const request = getUrlAttributes(req);
    if ((JSON.stringify(request).length > 5) && (!request.hasOwnProperty('page')) && (!request.hasOwnProperty('limit'))) {
        getByAttribute(request, res);
    } else {
        getAll(req, res);
    }
}

const getAll = (req, res) => {

    if (req.query.limit) {
        if (!containsOnlyNumbers(req.query.limit)) {
            return res.sendStatus(400);
        }
    }

    if (req.query.page) {
        if (!containsOnlyNumbers(req.query.page)) {
            return res.sendStatus(400);
        }
    }

    let limit = parseInt(req.query.limit || 0);
    let page = parseInt(req.query.page || 0);

    let ITEMS_BY_PAGE = 20;

    limit = limit > ITEMS_BY_PAGE || limit <= 0 ? ITEMS_BY_PAGE : limit;
    page = page <= 0 ? 0 : page * limit;

    visited.findAll({limit: limit, offset: page})
        .then(all => {
            return res.json(all);
        })
        .catch(e => {
            return res.sendStatus(404)
        })
}

const containsOnlyNumbers = (str) => {
    if (str) {
        let array = str.split('');
        for (let char of array) {
            if (isNaN(char)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

const containsOnlyLetters = (str) => {
    if (str) {
        return str.match(/^[A-Za-z ]+$/)
    }
    return false;
}

const getByAttribute = (request, res) => {

    let data = {};

    if (request.city) {
        data.city = request.city
    }
    if (request.incountry) {
        data.incountry = request.incountry
    }
    if (request.date) {
        data.date = request.date
    }

    visited.findAll(
        {
            where: data
        }
    )
        .then(item => {
            if (item.length > 0) {
                return res.json(item)
            } else {
                throw e
            }
        })
        .catch(e => {
            return res.sendStatus(404)
        })
}

exports.getById = (req, res) => {
    visited.findByPk(req.params.id)
        .then(item => {
            if (item) {
                return res.json(item)
            } else {
                throw e
            }
        })
        .catch(e => {
            return res.sendStatus(404)
        })
}

exports.add = (req, res) => {
    const data = req.body;

    if ((!data.city) || (!data.incountry) || (!data.date)) {
        return res.sendStatus(400);
    }

    if ((containsOnlyLetters(data.city)) && (containsOnlyLetters(data.incountry))) {
        visited.create(
            {
                city: treat(data.city),
                incountry: treat(data.incountry),
                date: data.date
            }
        )
            .then(() => {
                return res.sendStatus(201)
            })
            .catch(e => {
                return res.send(e)
            });
    } else {
        return res.sendStatus(400)
    }
}

const treat = (str) => {
    if (typeof str === "string") {
        return str.replace(/\s{2,}/g, ' ').trim()
    }
    return ""
}

exports.remove = (req, res) => {
    const id = req.params.id;

    visited.findByPk(id)
        .then(item => {
            if (item) {
                visited.destroy({
                    where: {id: id}
                })
                    .then(() => {
                        res.sendStatus(200)
                    })
                    .catch(error => next(error));
            } else {
                return res.sendStatus(404);
            }
        })
        .catch(e => {
            return res.sendStatus(500)
        });
}

const getUrlAttributes = function (req) {
    let q = req.url.split('?'), result = {};
    if (q.length >= 2) {
        q[1].split('&').forEach((item) => {
            try {
                result[item.split('=')[0]] = item.split('=')[1];
            } catch (e) {
                result[item.split('=')[0]] = '';
            }
        })
    }
    return result;
}

exports.update = (req, res) => {
    const id = req.params.id;

    const data = req.body;

    visited.findByPk(id).then(item => {
        if (item) {
            visited.update(
                {
                    city: treat(data.city),
                    inCountry: treat(data.incountry),
                    date: data.date
                },
                {where: {id: id}}
            ).then(() => {
                return res.sendStatus(200);
            }).catch(e => {
                return res.sendStatus(400)
            });
        } else {
            return res.sendStatus(404);
        }
    }).catch(e => {
        return req.sendStatus(500);
    });
}