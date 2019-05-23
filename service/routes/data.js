/*
 * @Author: Tianqiang Liu 
 * @Date: 2019-05-06 15:10:28 
 * @Last Modified by: Tianqiang Liu
 * @Last Modified time: 2019-05-23 10:48:23
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

/* Read data. for client*/
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
        var obj = [];
        try{
            obj = JSON.parse(data.toString());
        }catch(e){
            obj =[];
        }
        if(obj.length>COUNT){
            obj = obj.slice(0,COUNT);
        }
        return res.send({
            status:1,
            data:obj
        });
    });
});

//Data Saveing developing
router.post('/write',function(req,res,next){
    if(!req.session.user){
        return res.send({
            status:0,
            info: 'need to login'
        });
      }
    //name
    var type = req.param('type') || '';
    //keyword
    var url = req.param('url') || '';
    var title = req.param('title') || '';
    var img = req.param('img') || '';
    if(!type || !url || !title || !img){
        return res.send({
            status:0,
            info:'info is missing'
        });
    }
    //1)read file
    var filePath = PATH + type +'.json';
    fs.readFile(PATH + type + '.json', function(err,data){
        if(err){
            return res.send({
                status:0,
                info:'error read file'
            });
        }

        var arr  = JSON.parse(data.toString());
        //Log
        var obj = {
            img: img,
            url: url,
            title: title,
            id: guidGenerate(),
            time:new Date()
        };
        
        arr.splice(0, 0, obj);

        //2)write file
        var newData = JSON.stringify(arr);
        fs.writeFile(filePath,newData,function(err){
            if(err){
                return res.send({
                    status:0,
                    info:'fail write file'
                });
            }
            return res.send({
                status:1,
                info:obj
            });
        });
    });
    
});

//Articles
router.post('/write-config',function(req,res,next){
    if(!req.session.user){
        return res.send({
            status:0,
            info: 'need to login'
        });
      }
    //TODO:data validation.
    //stop xss attack
    //npm install xss
    //require('xss')
    // var str = xss(name);
    var data = req.body.data;
    //TODO:tryCatch
    var obj = JSON.parse(data);
    var newData = JSON.stringify(obj);
    fs.writeFile(PATH + 'config.json',newData,function(err){
        if(err){
            return res.send({
                status:0,
                info:'Fail write file'
            });
        }
        return res.send({
            status:1,
            info:obj
        });
    });
});

//Login interface
router.post('/login',function(req,res,next){
    //username, password, identify password
    var username = req.body.username;
    var password = req.body.password;

    //TODO : validating username or password
    //xss stop

    //password encrpytion md5(password + 'random')
    //then write to .json
    if(username === 'admin' && password === '123456' ){
        req.session.user = {
            username: username
        };
        return res.send({
            status: 1
        });
    }
    return res.send({
        status: 0,
        info: 'password wrong'
    });

});

//GUID
function guidGenerate(){
    return 'xxxxxxx-xxxx-xxx-yxxx-xxxxxxxxxxx'.replace(/[xy]/g,function(c){
        var r = Math.random()*16|0,
        v =c =='x' ? r:(r&0x3|0x8);
        return v.toString();

    }).toUpperCase();
}

module.exports = router;
