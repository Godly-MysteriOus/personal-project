const mongoose = require('mongoose');

exports.DB_Connections = {
  DEV_URI : 'mongodb+srv://jayant-singh:Jagrati_Sanju2510@medicine-project.xzrd8.mongodb.net/devDB?&w=majority&appName=Medicine-Project',
  TEST_DB_URI : 'mongodb+srv://jayant-singh:Jagrati_Sanju2510@medicine-project.xzrd8.mongodb.net/testDB?&w=majority&appName=Medicine-Project',
  PROD_DB : 'mongodb+srv://jayant-singh:Jagrati_Sanju2510@medicine-project.xzrd8.mongodb.net/prodDB?&w=majority&appName=Medicine-Project',
}
exports.devDBConnection = (app,PORT_NUMBER)=>{
    mongoose.connect(this.DB_Connections.DEV_URI)
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