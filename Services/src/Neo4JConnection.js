var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','nbpnbp'));

module.exports = {driver:driver};
