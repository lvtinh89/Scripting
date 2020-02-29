//Script event auto linked ipv4 nextdns: network-change

$httpClient.get('https://link-ip.nextdns.io/28adad/2bb24958f8e43281', function(error, response, data){
  if (error) {
console.log(error + '‼️');
  } else {
console.log(data);
$done();
  }
});