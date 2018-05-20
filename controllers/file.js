var path = require('path');
var fs = require('fs');
const uuidv4 = require('uuid/v4');


exports.getFile =async  function(req,res)
{
    res.sendFile(path.join(__dirname, '../files', req.params.uuid));
}

exports.postFile = async function(req,res){
    var nameFile = uuidv4();
    if (!req.files)
    {
        return res.status(400).send('No files were uploaded.');
    }
    let file = req.files.file;
    //console.log(file);
 
    file.mv('files/'+ nameFile, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send({dir:nameFile});
  });
}