const mysql = require('../utils/mysqlConfig')
const moment = require('moment')
//获取文章列表
const articleList = async (req, res, next) => {
    let pageNo = req.query.pageNo || 1
    let pageSize = req.query.pageSize || 20
    pageNo = (pageNo - 1) * pageSize
    var sql = `SELECT * FROM users right join article on users.userId = article.userId ORDER BY articleId LIMIT ${pageNo}, ${pageSize}`;
    // var sqlNext = `SELECT * FROM users right join article on users.userId = article.userId ORDER BY articleId LIMIT ${pageNo+pageSize}, ${pageSize}`;
    mysql.query(sql, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR]:', err.message);
        }
        let hasMore = false
        res.json({
            code: 'A0000',
            msg: 'success',
            data: {
                hasMore: hasMore,
                list: result,
            }
        })
        // mysql.query(sqlNext,(err,resw)=>{
        //     let hasMore = false
        //     if(resw.length>0){
        //         hasMore = true
        //     }
        //     res.json({
        //         code: 'A0000',
        //         msg: 'success',
        //         data: {
        //             hasMore: hasMore,
        //             list: result,
        //         }
        //     })
        // })
        
    });
    // mysql.end();
}
//添加文章
const addArticle = async (req, res, next) => {
    var params = req.body
    let createTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    params.createTime = createTime
    var sql = `INSERT INTO article set ?`;
    mysql.query(sql, params, (err, result) => {
        if (!err) {
            res.json({
                code: 'A0000',
                msg: 'success',
                createTime: createTime
            })
        } else {
            res.json({
                code: 500,
                data: err
            })
            console.log('[SELECT ERROR]:', err.message);
        }

    });
}
//获得某一篇文章
const getArticle = async (req, res, next) => {
    let articleId = req.query.id || ''
    var sql = `SELECT * FROM users right join article on users.userId = article.userId where article.articleId=${articleId}`;
    mysql.query(sql, (err, result) => {
        console.log(result);
        if (err) {
            console.log('[SELECT ERROR]:', err.message);
        }
        if (result.length > 0) {
            res.json({
                code: 'A0000',
                msg: 'success',
                data: result,
            })
        } else {
            res.json({
                code: 'E0001',
                msg: '没有这篇文章',
            })
        }
    });
}

const updateArticle = async (req, res, next) => {
    let content = req.body.contents
    let articleId = req.body.articleId
    let title = content.blocks[0].text
    let contents = JSON.stringify(content)
    let updateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    var sql = `UPDATE article SET title='${title}', contents='${contents}', updateTime='${updateTime}' WHERE articleId = ${articleId}`;
    mysql.query(sql, (err, result) => {
        if (err) {
            res.json({
                code: 500,
                msg: err.message
            })
            console.log('[SELECT ERROR]:', err.message);
        } else {
            console.log('更新数据库成功');
            res.json({
                code: 'A0000',
                msg: 'success',
            })
        }
    });
}
module.exports = {
    articleList,
    addArticle,
    updateArticle,
    getArticle
}