const mongoose = require('mongoose');
const credential = require('../config');
exports.DB_Connections = {
  DEV_URI : credential.devURI,
  TEST_DB_URI : credential.testURI,
  PROD_DB : credential.prodURI,
}
exports.devDBConnection = (app,PORT_NUMBER)=>{
    mongoose.connect(DB_Connections.DEV_URI)
    .then(result => app.listen(PORT_NUMBER))
    .then(()=>console.log('connected to the server'))
    .catch(err => {
      console.log(err);
    });
};
exports.testDBConnection = (app,PORT_NUMBER)=>{
    mongoose.connect(this.DB_Connections.TEST_DB_URI)
    .then(result => app.listen(PORT_NUMBER))
    .catch(err => {
      console.log(err);
    });
};
exports.prodDBConnection = (app,PORT_NUMBER)=>{
    mongoose.connect(this.DB_Connections.PROD_DB)
    .then(result => app.listen(PORT_NUMBER))
    .catch(err => {
      console.log(err);
    });
};