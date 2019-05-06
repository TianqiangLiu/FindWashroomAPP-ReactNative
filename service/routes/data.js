/*
 * @Author: Tianqiang Liu 
 * @Date: 2019-05-06 15:10:28 
 * @Last Modified by: Tianqiang Liu
 * @Last Modified time: 2019-05-06 15:48:17
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

/* Read data. */
//data/read?type=it
router.get('/read', function(req, res, next) {
  var type = req.param('type') || '';
    fs.readFile(PATH + type + '.json', function(err, data){
        if(err){
            return res.send({
                status:0,
                info:'Read Error'
            });
        }
        var COUNT = 50;
        var obj = JSON.parse(data.toString());
        if(obj.length>COUNT){
            obj = obj.slice(0,COUNT);
        }
        return res.send({
            status:1,
            data:obj
        });
    });
});

module.exports = router;
