'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/public', _express2.default.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, 'index.html'));
});

var port = process.env.PORT || 8080;

app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + port);
});
