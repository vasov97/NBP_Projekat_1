var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','nbpnbp'));
var session = driver.session();

module.exports = {driver:driver,session:session};
