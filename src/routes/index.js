var express = require('express');
var router = express.Router();

var React = require('react');
var ReactDOMServer = require('react-dom/server');

//var App = require('../components/App');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  /*res.setHeader('Content-Type', 'text/html');
    var html = ReactDOMServer.renderToStaticMarkup(
      <body>
        <div id="content" dangerouslySetInnerHTML={{__html:
          ReactDOMServer.renderToString(<App items={props.items}/>)
        }} />
        <script src="/bundle.js"/>
      </body>
    );
    res.end(html);*/
});

module.exports = router;
